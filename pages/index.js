import React from 'react';
import ChatWidget from '../components/chat';
import styles from '../styles/Home.module.css'; // Import scoped CSS module
import Image from 'next/image';
const Index = () => {
  return (
    <div className={styles.main}>

    <div className={styles.background}>
      <div className={styles.box}></div>

      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>

      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
 
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
 
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
 
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>
     
      <div className={styles.box}></div>
      <div className={styles.box}></div>
      <div className={styles.box}></div>

       <div className={styles.overlayImage}>
          <Image
            src="/images/imp.png"
            alt="Grandma Chatbot"
            width={300}
            height={300}
            />
        </div>
       <div className={styles.overlayImage2}>
          <Image
            src="/images/1.png"
            alt="Grandma Chatbot"
            width={300}
            height={300}
            />
        </div>
       <div className={styles.overlayImage1}>
          <Image
            src="/images/2.png"
            alt="Grandma Chatbot"
            width={300}
            height={300}
            />
        </div>
      
      <ChatWidget
        siteURL={'AI'}
        apiKey={process.env.NEXT_PUBLIC_OPENAI_API_KEY}
        lang={'english'}
        />
    </div>
        </div>
  );
};

export default Index;
