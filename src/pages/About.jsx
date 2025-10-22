import React from "react";
import "../style.css";

export default function About (){
    return (
        <section className="about-us">
            <div className="about-container">
                <header className="about-header">
                    <h1 className="montserrat-bold">Your Destination for Liquid Happiness</h1>
                    <p className="josefin-text-lg">We believe that every great moment deserves the perfect drink. We are a destination for discovery, where quality, knowledge, and community come together.</p>
                </header>

                <hr className="separator" />

                <div className="about-story">
                    <h2 className="montserrat-title">Our Story and Philosophy</h2>
                    <p className="josefin-text">
                        BottleDrop was founded in **2019** by lifelong friends and cocktail enthusiasts, **Alex Riley and Maya Chen**. They had a simple goal: to replace the dusty, intimidating liquor store experience with a bright, curated, and approachable hub. Alex, the former bar manager, focused on spirits; Maya, the travel blogger, curated the wine list.
                    </p>
                    <p className="josefin-text">
                        Our mission is simple: **to uncork happiness and make every choice a celebration.** We hand-select every bottle on our shelves, ensuring that whether you're looking for a classic favorite or a rare new find, it meets our high standard of quality and value.
                    </p>
                </div>

                <hr className="separator" />

                    <h2 className="montserrat-title">What Sets Us Apart</h2>
                <div className="about-features">
                    
                    <div className="feature-card">
                        <h3 className="montserrat-subtitle">1. The Curated Collection</h3>
                        <p className="josefin-text">We don't try to stock every brand; we focus on stocking the **best of every category.** Our favorite sections include experimental gin batches and our "Cellar of Forgotten Wines," featuring lesser-known European vineyards.</p>
                    </div>
                    
                    <div className="feature-card">
                        <h3 className="montserrat-subtitle">2. Expert, Approachable Guidance</h3>
                        <p className="josefin-text">Our staff are passionate spirits advisors trained in the art of the perfect pairing. We skip the jargon and focus on getting to know your taste. We're here to guide your journey from curiosity to confidence.</p>
                    </div>
                    
                    <div className="feature-card">
                        <h3 className="montserrat-subtitle">3. Rooted in Community</h3>
                        <p className="josefin-text">We proudly serve the **Maplewood Heights** community. We host weekly "Thirsty Thursday Tastings" and feature local fictional brands like "Stone Creek Brews." Your support keeps our shared spirit community thriving.</p>
                    </div>
                </div>
            </div>
        </section>

    );
}