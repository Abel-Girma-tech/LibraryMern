import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Lower() {
    return (
        <footer id="footer_div">
        <div className="footer_content">
            <div className="footer_section">
                <h2>Bella Books</h2>
                <p>Your favorite place for books.</p>
            </div>
            <div className="footer_section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/collections">Collections</a></li>
                    <li><a href="/donate">Donate-Book</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            <div className="footer_section">
                <h3>Follow Us</h3>
                <div className="social_icons">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                </div>
            </div>
            <div className="footer_section">
                <h3>Contact Us</h3>
                <p>Email: info@bellabooks.com</p>
                <p>Phone: +123 456 7890</p>
            </div>
        </div>
        <div className="footer_bottom">
            <p>&copy; 2024 Bella Books. All rights reserved.</p>
        </div>
    </footer>
    )
}
