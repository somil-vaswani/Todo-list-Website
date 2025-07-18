import React from 'react'

export default function Footer() {
  const footerStyle= {
    position: "relative",
    top: "50vh",
    width: "100%"
  };
  return (
    <footer className="bg-dark text-light py-3"  style={footerStyle}>
      <p className="text-center mb-0">Copyright &copy; MyTodosList.com</p>
      <p className="text-center mb-0">All rights reserved</p>
    </footer>
  )
}
