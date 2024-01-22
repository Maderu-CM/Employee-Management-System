import React from 'react';

const Dashboard = () => {
    return (
        <div className="container text-center mt-5">
            <div className="border p-4" style={{ borderColor: 'blue' }}>
                <h1>EMPLOYEE HUB</h1>

                <div>
                    <p>
                        We're delighted to welcome you to the Employee Hub, your central platform for managing the workforce efficiently and effortlessly. Whether you're registering new workers, editing details, adding departments, or handling other HR tasks, the Employee Hub is designed to streamline your processes and enhance your HR management experience.
                    </p>

                    <p>
                        Explore the intuitive features and tools tailored to meet your HR needs. From seamless worker registration to department management, our platform is here to simplify your daily operations. Feel free to navigate through the dashboard, access quick links, and make the most of the robust functionalities at your disposal.
                    </p>
                </div>

                <div>
                    <h3>Feedback</h3>
                    <form>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="email"
                                name="email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="message"
                                name="message"
                            />
                        </div>

                        <div className="text-center">
                            <button className="btn btn-primary">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
