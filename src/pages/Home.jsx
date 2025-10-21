import React from "react";
import Header from '../components/Header.jsx';
import Body from '../components/Body.jsx';
import Footer from '../components/Footer.jsx';

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Body />
        </main>
        <Footer />
    </div>
  );
}
