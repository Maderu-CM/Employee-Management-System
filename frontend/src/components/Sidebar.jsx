import React, { useState } from 'react';
import { FaBars, FaUserAlt, FaUsers, FaSitemap, FaThList, FaPortrait } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const menuItem = [
        {
            path: "/addemployee",
            name: "Add Employee",
            icon: <FaUserAlt />
        },
        {
            path: "/viewemployees",
            name: "View Employees",
            icon: <FaUsers />
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <FaPortrait />
        },
        {
            path: "/adddepartment",
            name: "Add Department",
            icon: <FaThList />
        },
        {
            path: "/viewdepartment",
            name: "View Department",
            icon: <FaSitemap />
        }
    ];

    return (
        <div className="container">
            <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <NavLink to="/" className="logo">
                        <h1 style={{ display: isOpen ? "block" : "none" }}>EH</h1>
                    </NavLink>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeClassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;
