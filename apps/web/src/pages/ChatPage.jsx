import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header, MaterialIcon, useAuth, supabase } from '@prophub/shared';

export default function ChatPage() {
  const { id } = useParams(); // URL /chat/:id -> where id is property_id
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Will store conversation ID: `${propertyId}_${otherUserId}`
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(!!id);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number || 0);
  };

  // 1. Fetch existing messages and build conversation list
  useEffect(() => {
    const fetchChatData = async () => {
      if (!user) return;
      
      try {
        // Ambil semua pesan untuk user ini
        const { data: messages, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const contactsMap = {};
        messages.forEach(msg => {
          const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
          const key = `${msg.property_id}_${otherUserId}`;
          
          if (!contactsMap[key]) {
            contactsMap[key] = {
              id: key,
              propertyId: msg.property_id,
              otherUserId: otherUserId,
              messages: [],
              lastMessage: '',
              lastTime: '',
              unread: 0
            };
          }
          contactsMap[key].messages.push(msg);
          contactsMap[key].lastMessage = msg.content;
          contactsMap[key].lastTime = formatTime(msg.created_at);
          if (!msg.is_read && msg.receiver_id === user.id) {
            contactsMap[key].unread += 1;
          }
        });

        // Fetch profil & properti untuk percakapan tersebut
        const propertyIds = [...new Set(Object.values(contactsMap).map(c => c.propertyId))];
        const userIds = [...new Set(Object.values(contactsMap).map(c => c.otherUserId))];

        let properties = [];
        let profiles = [];

        if (propertyIds.length > 0) {
          const { data: propsData } = await supabase.from('properties').select('*').in('id', propertyIds);
          properties = propsData || [];
        }
        if (userIds.length > 0) {
          const { data: profsData } = await supabase.from('profiles').select('*').in('id', userIds);
          profiles = profsData || [];
        }

        const finalConversations = Object.values(contactsMap).map(c => {
          const prop = properties.find(p => p.id === c.propertyId);
          const otherUser = profiles.find(p => p.id === c.otherUserId);
          
          return {
            ...c,
            name: otherUser?.full_name || 'Pengguna',
            initials: (otherUser?.full_name || 'U').substring(0, 2).toUpperCase(),
            avatar: otherUser?.avatar_url,
            property: prop?.title || 'Properti',
            propertyLocation: prop?.location || '',
            propertyPrice: formatRupiah(prop?.price_per_month),
            propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
            messages: c.messages.map(m => ({
              id: m.id,
              sender: m.sender_id === user.id ? 'user' : 'other',
              text: m.content,
              time: formatTime(m.created_at)
            }))
          };
        });

        // Urutkan berdasarkan pesan terakhir
        finalConversations.sort((a, b) => b.messages[b.messages.length - 1]?.id - a.messages[a.messages.length - 1]?.id);
        
        setConversations(finalConversations);
      } catch (err) {
        console.error('Error fetching chat data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [user]);

  // 2. Jika ada ID properti di URL, pastikan percakapan dengan pemilik ada
  useEffect(() => {
    const ensureNewConversation = async () => {
      if (!id || !user || loading) return;
      
      try {
        const { data: prop } = await supabase
          .from('properties')
          .select('*, owner:profiles!owner_id(*)')
          .eq('id', id)
          .single();
          
        if (prop) {
          const otherUserId = prop.owner_id;
          if (otherUserId === user.id) return; // Jangan chat diri sendiri
          
          const convId = `${id}_${otherUserId}`;
          
          setConversations(prev => {
            const exists = prev.find(c => c.id === convId);
            if (exists) {
              if (!activeChat) setActiveChat(convId);
              return prev;
            }
            // Buat percakapan kosong baru
            const newConv = {
              id: convId,
              propertyId: prop.id,
              otherUserId: otherUserId,
              name: prop.owner?.full_name || 'Pemilik',
              initials: (prop.owner?.full_name || 'P').substring(0, 2).toUpperCase(),
              avatar: prop.owner?.avatar_url,
              property: prop.title,
              propertyLocation: prop.location,
              propertyPrice: formatRupiah(prop.price_per_month),
              propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
              messages: [],
              lastMessage: 'Mulai obrolan...',
              lastTime: '',
              unread: 0
            };
            
            if (!activeChat) setActiveChat(convId);
            return [newConv, ...prev];
          });
        }
      } catch (err) {
        console.error('Error ensuring conversation:', err.message);
      }
    };
    
    ensureNewConversation();
  }, [id, user, loading, activeChat]);

  // 3. Supabase Realtime Subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMessage = payload.new;
        
        // Cek apakah pesan untuk/dari saya
        if (newMessage.sender_id !== user.id && newMessage.receiver_id !== user.id) return;
        
        const otherUserId = newMessage.sender_id === user.id ? newMessage.receiver_id : newMessage.sender_id;
        const convId = `${newMessage.property_id}_${otherUserId}`;

        setConversations(prev => {
          const index = prev.findIndex(c => c.id === convId);
          if (index === -1) {
            // Jika pesan dari percakapan baru, sebaiknya kita muat ulang secara utuh
            // Untuk prototipe, ini sudah cukup agar simpel.
            return prev;
          }

          const conv = prev[index];
          // Hindari duplikasi
          if (conv.messages.find(m => m.id === newMessage.id)) return prev;

          const updatedConv = {
            ...conv,
            lastMessage: newMessage.content,
            lastTime: formatTime(newMessage.created_at),
            messages: [
              ...conv.messages,
              {
                id: newMessage.id,
                sender: newMessage.sender_id === user.id ? 'user' : 'other',
                text: newMessage.content,
                time: formatTime(newMessage.created_at)
              }
            ]
          };

          // Pindahkan ke atas
          const newConversations = [...prev];
          newConversations.splice(index, 1);
          return [updatedConv, ...newConversations];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);


  const activeConversation = conversations.find((c) => c.id === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat, activeConversation?.messages?.length]);

  const handleSelectChat = (convId) => {
    setActiveChat(convId);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
  };

  const handleSend = async () => {
    if (!message.trim() || !activeConversation || !user) return;

    const contentToSend = message.trim();
    setMessage('');
    
    // Optimistic UI update can be done here if needed, but Realtime will catch it anyway.
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: activeConversation.otherUserId,
        property_id: activeConversation.propertyId,
        content: contentToSend
      });
      
      if (error) throw error;
      
      inputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err.message);
      alert('Gagal mengirim pesan');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return (
      <div className="bg-background text-on-background h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <MaterialIcon icon="lock" className="text-7xl text-on-surface-variant mb-4" />
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-2">Harap Login</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Anda harus login untuk menggunakan fitur obrolan.</p>
          <Link to="/login" className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity">
            Masuk ke Akun
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden max-w-container-max mx-auto w-full">
        {/* Sidebar - Conversation List */}
        <aside className={`w-full md:w-80 lg:w-96 border-r border-outline-variant bg-surface-container-lowest flex flex-col shrink-0 ${showChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-outline-variant">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-3">Pesan</h2>
            <div className="relative">
              <MaterialIcon icon="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl" />
              <input
                type="text"
                placeholder="Cari percakapan..."
                className="w-full bg-surface-container rounded-xl pl-10 pr-4 py-2.5 border border-outline-variant font-body-sm text-body-sm text-on-surface focus:ring-secondary focus:border-secondary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div></div>
            ) : conversations.length === 0 ? (
              <div className="text-center p-8 text-on-surface-variant font-body-md">Belum ada percakapan.</div>
            ) : conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectChat(conv.id)}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-outline-variant/50 ${
                  activeChat === conv.id
                    ? 'bg-surface-container'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-label-md text-label-md text-on-surface-variant">{conv.initials}</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface truncate">{conv.name}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 ml-2">{conv.lastTime}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{conv.property}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5 opacity-70">{conv.lastMessage}</p>
                </div>

                {conv.unread > 0 && (
                  <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center shrink-0 mt-1">
                    <span className="text-on-secondary text-[10px] font-bold">{conv.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        {activeConversation ? (
          <div className={`flex-1 flex-col bg-background ${showChat ? 'flex' : 'hidden md:flex'}`}>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-outline-variant bg-surface-container-lowest shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={handleBack} className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors" aria-label="Kembali">
                  <MaterialIcon icon="arrow_back" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden">
                    {activeConversation.avatar ? (
                      <img src={activeConversation.avatar} alt={activeConversation.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-label-md text-label-md text-on-surface-variant">{activeConversation.initials}</span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface">{activeConversation.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/property/${activeConversation.propertyId}`}
                  className="hidden sm:flex items-center gap-2 bg-surface-container px-4 py-2 rounded-xl font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  <MaterialIcon icon="home" className="text-lg text-secondary" />
                  Lihat Properti
                </Link>
                <button aria-label="Opsi lainnya" className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
                  <MaterialIcon icon="more_vert" />
                </button>
              </div>
            </div>

            {/* Property Info Banner */}
            <div className="mx-4 md:mx-6 mt-4 bg-surface-container rounded-xl p-3 flex items-center gap-3 border border-outline-variant/30">
              <img
                src={activeConversation.propertyImage}
                alt={activeConversation.property}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md text-on-surface truncate">{activeConversation.property}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{activeConversation.propertyLocation}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-label-md text-label-md text-secondary">{activeConversation.propertyPrice}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="font-label-sm text-label-sm text-on-surface-variant px-2">Percakapan Terenkripsi</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              {activeConversation.messages.map((msg, i) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id || i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isUser
                          ? 'bg-secondary text-on-secondary rounded-br-md'
                          : 'bg-surface-container-high text-on-surface rounded-bl-md'
                      }`}
                    >
                      <p className="font-body-md text-body-md whitespace-pre-wrap">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${isUser ? 'text-on-secondary/70' : 'text-on-surface-variant'}`}>
                        <span className="font-label-sm text-[11px]">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-4 md:px-6 py-4 border-t border-outline-variant bg-surface-container-lowest">
              <div className="flex items-end gap-3">
                <button aria-label="Lampirkan file" className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0 mb-0.5">
                  <MaterialIcon icon="attach_file" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan..."
                    rows={1}
                    className="w-full bg-surface-container rounded-2xl px-4 py-3 pr-12 border border-outline-variant font-body-md text-body-md text-on-surface focus:ring-secondary focus:border-secondary focus:outline-none resize-none max-h-32"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  aria-label="Kirim pesan"
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mb-0.5 transition-all ${
                    message.trim()
                      ? 'bg-secondary text-on-secondary hover:opacity-90 scale-100 shadow-md'
                      : 'bg-surface-container-high text-on-surface-variant scale-95'
                  }`}
                >
                  <MaterialIcon icon="send" className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className={`flex-1 flex-col items-center justify-center bg-background text-center p-8 ${showChat ? 'flex' : 'hidden md:flex'}`}>
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6">
              <MaterialIcon icon="chat_bubble_outline" className="text-5xl text-on-surface-variant" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Pilih percakapan</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Pilih salah satu percakapan di samping untuk memulai chat dengan pemilik atau penyewa properti.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
