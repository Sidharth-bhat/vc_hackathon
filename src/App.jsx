import React, { useState, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [singleWordMap, setSingleWordMap] = useState({});
  const [multiWordMap, setMultiWordMap] = useState({});
  const [emojiToKeywordsMap, setEmojiToKeywordsMap] = useState({});
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    fetch('/data/emoji.json')
      .then(response => response.json())
      .then(data => {
        const singleMap = {};
        const multiMap = {};
        const emojiMap = {};
        data.forEach(item => {
          const keywords = [...(item.aliases || []), ...(item.tags || [])];
          emojiMap[item.emoji] = keywords;
          
          keywords.forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes(' ')) {
              multiMap[lowerKey] = item.emoji;
            } else {
              singleMap[lowerKey] = item.emoji;
            }
          });
        });
        setSingleWordMap(singleMap);
        setMultiWordMap(multiMap);
        setEmojiToKeywordsMap(emojiMap);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading emoji data:', error);
        setIsLoading(false);
      });
  }, []);

  const translateText = () => {
    if (isReversed) {
      // Emoji to text translation
      const results = [];
      for (const char of inputText) {
        const keywords = emojiToKeywordsMap[char];
        results.push(keywords ? keywords[0] : char);
      }
      setTranslatedText(results.join(''));
    } else {
      // Text to emoji translation
      const text = inputText.toLowerCase();
      const results = [];
      let i = 0;
      
      while (i < text.length) {
        let matched = false;
        
        // Check for multi-word matches (longest first)
        const phrases = Object.keys(multiWordMap).sort((a, b) => b.length - a.length);
        for (const phrase of phrases) {
          if (text.substring(i, i + phrase.length) === phrase && 
              (i + phrase.length === text.length || !/\w/.test(text[i + phrase.length]))) {
            results.push(multiWordMap[phrase]);
            i += phrase.length;
            matched = true;
            break;
          }
        }
        
        if (!matched) {
          // Check for single word
          let wordEnd = i;
          while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
            wordEnd++;
          }
          
          if (wordEnd > i) {
            const word = text.substring(i, wordEnd);
            const originalWord = inputText.substring(i, wordEnd);
            
            // Try exact match first
            let emoji = singleWordMap[word];
            
            // If no match and word ends with 's', try singular form
            if (!emoji && word.endsWith('s') && word.length > 1) {
              const singular = word.slice(0, -1);
              emoji = singleWordMap[singular];
            }
            
            results.push(emoji || originalWord);
            i = wordEnd;
          } else {
            results.push(inputText[i]);
            i++;
          }
        }
      }
      
      setTranslatedText(results.join(''));
    }
  };
  
  const clearText = () => {
    setInputText('');
    setTranslatedText('');
  };
  
  const swapMode = () => {
    setIsReversed(!isReversed);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes drift {
          0% { transform: translateX(-20px) translateY(0px); }
          50% { transform: translateX(20px) translateY(-15px); }
          100% { transform: translateX(-20px) translateY(0px); }
        }
        .enchanted-forest {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #0f172a 0%, #134e4a 100%);
          pointer-events: none;
          z-index: 1;
        }
        .forest-animals {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .forest-animals span {
          position: absolute;
          animation: drift infinite alternate ease-in-out;
        }
        .forest-animals span:nth-child(1) { top: 10%; left: 15%; font-size: 28px; opacity: 0.7; animation-duration: 25s; animation-delay: 0s; }
        .forest-animals span:nth-child(2) { top: 20%; left: 80%; font-size: 22px; opacity: 0.6; animation-duration: 35s; animation-delay: 5s; }
        .forest-animals span:nth-child(3) { top: 35%; left: 25%; font-size: 32px; opacity: 0.8; animation-duration: 40s; animation-delay: 10s; }
        .forest-animals span:nth-child(4) { top: 50%; left: 70%; font-size: 26px; opacity: 0.5; animation-duration: 30s; animation-delay: 2s; }
        .forest-animals span:nth-child(5) { top: 65%; left: 10%; font-size: 24px; opacity: 0.7; animation-duration: 45s; animation-delay: 8s; }
        .forest-animals span:nth-child(6) { top: 75%; left: 85%; font-size: 20px; opacity: 0.6; animation-duration: 28s; animation-delay: 15s; }
        .forest-animals span:nth-child(7) { top: 15%; left: 50%; font-size: 30px; opacity: 0.8; animation-duration: 38s; animation-delay: 3s; }
        .forest-animals span:nth-child(8) { top: 40%; left: 90%; font-size: 18px; opacity: 0.5; animation-duration: 33s; animation-delay: 12s; }
        .forest-animals span:nth-child(9) { top: 60%; left: 40%; font-size: 26px; opacity: 0.7; animation-duration: 42s; animation-delay: 6s; }
        .forest-animals span:nth-child(10) { top: 80%; left: 60%; font-size: 24px; opacity: 0.6; animation-duration: 36s; animation-delay: 9s; }
        .forest-animals span:nth-child(11) { top: 25%; left: 5%; font-size: 22px; opacity: 0.8; animation-duration: 29s; animation-delay: 4s; }
        .forest-animals span:nth-child(12) { top: 45%; left: 75%; font-size: 28px; opacity: 0.5; animation-duration: 41s; animation-delay: 11s; }
        .forest-animals span:nth-child(13) { top: 70%; left: 30%; font-size: 20px; opacity: 0.7; animation-duration: 34s; animation-delay: 7s; }
        .forest-animals span:nth-child(14) { top: 85%; left: 20%; font-size: 26px; opacity: 0.6; animation-duration: 37s; animation-delay: 13s; }
        .forest-animals span:nth-child(15) { top: 30%; left: 65%; font-size: 24px; opacity: 0.8; animation-duration: 31s; animation-delay: 1s; }
      `}</style>
      
      <div style={{ fontFamily: 'Lora, serif', minHeight: '100vh', position: 'relative' }}>
        <div className="enchanted-forest"></div>
        <div className="forest-animals">
          <span>🦋</span>
          <span>🦉</span>
          <span>🦊</span>
          <span>🦌</span>
          <span>🐇</span>
          <span>🐿️</span>
          <span>🦔</span>
          <span>🐸</span>
          <span>🦝</span>
          <span>🐛</span>
          <span>🐌</span>
          <span>🦅</span>
          <span>🐝</span>
          <span>🐢</span>
          <span>🐰</span>
        </div>
        
        <div style={{ position: 'relative', zIndex: 10, padding: '3rem 1rem' }}>
          <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', textAlign: 'center', marginBottom: '0.5rem', color: '#f0fdf4' }}>
              AI Emoji Translator
            </h1>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#5eead4' }}>
              Intelligent bidirectional emoji translation
            </p>
            
            {isLoading && (
              <div style={{ textAlign: 'center', marginBottom: '2rem', color: '#5eead4' }}>
                Loading AI dictionary...
              </div>
            )}
            
            <div style={{ 
              backgroundColor: 'rgba(15, 118, 110, 0.6)', 
              backdropFilter: 'blur(12px)', 
              borderRadius: '1rem', 
              padding: '2rem', 
              border: '1px solid #5eead4',
              boxShadow: '0 0 30px rgba(94, 234, 212, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isReversed ? "Enter emojis to translate to text..." : "Enter text to translate to emojis..."}
                style={{
                  width: '100%',
                  height: '9rem',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  resize: 'none',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid #115e59',
                  color: '#f0fdf4',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                disabled={isLoading}
              />
              
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
                <button
                  onClick={swapMode}
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#115e59',
                    color: '#f0fdf4',
                    border: 'none',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#5eead4', e.target.style.boxShadow = '0 0 20px rgba(94, 234, 212, 0.5)')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#115e59', e.target.style.boxShadow = 'none')}
                  title="Swap translation direction"
                >
                  ⇅
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={translateText}
                  disabled={isLoading || !inputText.trim()}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#115e59',
                    color: '#f0fdf4',
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: (isLoading || !inputText.trim()) ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !(isLoading || !inputText.trim()) && (e.target.style.backgroundColor = '#5eead4', e.target.style.boxShadow = '0 0 20px rgba(94, 234, 212, 0.5)')}
                  onMouseLeave={(e) => !(isLoading || !inputText.trim()) && (e.target.style.backgroundColor = '#115e59', e.target.style.boxShadow = 'none')}
                >
                  Translate
                </button>
                <button
                  onClick={clearText}
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 2rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'transparent',
                    color: '#5eead4',
                    border: '2px solid #115e59',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: isLoading ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.borderColor = '#5eead4', e.target.style.boxShadow = '0 0 15px rgba(94, 234, 212, 0.3)')}
                  onMouseLeave={(e) => !isLoading && (e.target.style.borderColor = '#115e59', e.target.style.boxShadow = 'none')}
                >
                  Clear
                </button>
              </div>
              
              {translatedText && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #115e59'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#5eead4' }}>
                    {isReversed ? "Text Translation:" : "Emoji Translation:"}
                  </h3>
                  <div style={{ fontSize: '1.5rem', lineHeight: '1.6', color: '#f0fdf4' }}>
                    {translatedText}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;