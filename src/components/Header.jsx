import React from "react";
import "../style.css";

function Header() {
  return (
    <header>
	<nav class="navbar">
		<div class="navdiv">
			<div class="logo"><a href="#">BOTTLE DROP</a> </div>
			<ul>
				<li><a href="#">Home</a></li>
				<li><a href="#">About</a></li>
				<li><a href="#">Contact</a></li>
				<button><a href="#">SignIn</a></button>
			</ul>
		</div>
	</nav>
    </header>
  );
}

export default Header;
