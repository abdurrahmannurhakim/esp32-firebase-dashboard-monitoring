        // Import Firebase libraries
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
        import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

        // Your web app's Firebase configuration 
       const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);

        // Function to get cookie by name
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        // Function to check token
        async function checkToken() {
            const token = getCookie('token');
            if (!token) {
                // Redirect to login page if token is not found
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); // 2 seconds delay
                return;
            }

            const userRef = ref(database, 'login');

            try {
                const snapshot = await get(userRef);
                const userData = snapshot.val();
                console.log("get cookies: ", token);
                console.log("firebase token: ", userData.token);
                if (userData.token === token) {
                    console.log('Token matched');
                } else {
                    console.log('Token mismatch');
                    // Redirect to login page if token does not match
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000); // 2 seconds delay
                }
            } catch (error) {
                console.error('Error:', error);
                // Redirect to login page if an error occurs
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); // 2000 mili seconds delay
            }
        }

        // Check token on page load
        checkToken();

        // Logout function
        document.getElementById('logout').addEventListener('click', () => {
            // Clear the token cookie and redirect to login page
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500); // 500 mili seconds delay
        });

        // Navigation event listeners
        document.getElementById("dashboard").addEventListener("click", function() {
            showDashboard();
        });

        document.getElementById("list-user").addEventListener("click", function() {
            showListUser();
        });

        document.getElementById("schedule").addEventListener("click", function() {
            showSchedule();
        });

        document.getElementById("foodleftover").addEventListener("click", function() {
            showFoodleftover();
        });
        
        
        // Function to show dashboard content
        async function showDashboard() {
            const content = document.getElementById('content');;

            content.innerHTML = `
                <div class="main-image-container">
                    <img src="/dashboard.jpg" alt="Dashboard Main Image" class="main-image">
                </div>

                <div class="boxes">
                    <div class="box">
                            <h3>List User</h3>
                            <img src="/list-user.jpg" id = "box-user-name" onclick="window.location.href='your-link-here' alt="List User Image" class="box-image">
                    </div>
                    <div class="box">
                            <h3>Add Fish</h3>
                            <img src="/fish.jpg" id = "box-schedule" onclick="window.location.href='your-link-here' alt="Schedule Image" class="box-image" >
                    </div>
                    <div class="box">
                            <h3>Food Leftovers</h3>
                            <img src="/food.jpg" id = "box-food-leftovers" onclick="window.location.href='your-link-here' alt="Food Leftovers Image" class="box-image">
                        </div>
                </div>
                
            `;

            document.getElementById("box-user-name").addEventListener("click", async function() {
                await showListUser();
            });

            document.getElementById("box-schedule").addEventListener("click", async function() {
                await showSchedule();
            });

            document.getElementById("box-food-leftovers").addEventListener("click", async function() {
                await showFoodleftover();
            });

        }

        // Function to show list user content
        async function showListUser() {
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>List User</h2>
                <form id="add-user-form">
                    <input type="text" id="user-name-input" placeholder="Enter username" required>
                    <input type="text" id="user-id-input" placeholder="Enter telegram ID" required>
                    <button id="user-input" type="button">Add</button>
                </form>
                <table id="user-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Username</th>
                            <th>Telegram ID</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;
            document.getElementById("user-input").addEventListener("click", async function() {
                await addUser();
            });
            await loadUsers();
        }

        // Function to add user to Firebase
        async function addUser() {
            const userNameInput = document.getElementById('user-name-input');
            const userIdInput = document.getElementById('user-id-input');
            const newUserName = userNameInput.value.trim();
            const newUserId = userIdInput.value.trim();
            if (newUserName === "" || newUserId === "") return;

            const userRef = ref(database, 'dashboard/list-user');
            const snapshot = await get(userRef);
            
            let numChildren = 0;
            if (snapshot.exists()) {
                snapshot.forEach(() => {
                    numChildren++;
                });
                numChildren++;
            }

            const newUserRef = ref(database, `dashboard/list-user/${newUserName}`);
            await set(newUserRef, newUserId);
            userNameInput.value = "";
            userIdInput.value = "";
            await loadUsers();
        }

        // Function to load users from Firebase
        async function loadUsers() {
            const userRef = ref(database, 'dashboard/list-user');
            const snapshot = await get(userRef);
            const users = snapshot.val();
            const userTableBody = document.querySelector('#user-table tbody');
            userTableBody.innerHTML = "";

            if (users) {
                const keys = Object.keys(users);
                keys.forEach((key, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${key}</td>
                        <td>${users[key]}</td>
                        <td><button id="delete-user-${key}">Delete</button></td>
                    `;
                    userTableBody.appendChild(row);
                });

                keys.forEach((key) => {
                    document.getElementById(`delete-user-${key}`).addEventListener("click", async function() {
                        await deleteUser(key);
                        await loadUsers();
                    });
                });
            }
        }

        // Function to delete user from Firebase
        async function deleteUser(key) {
            const userRef = ref(database, `dashboard/list-user/${key}`);
            await remove(userRef);
        }

        // Function to show schedule content
        async function showSchedule() {
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>Add Fish</h2>
                <form id="add-schedule-form">
                    <input type="text" id="fish-name-input-schedule" placeholder="Enter fish name" required>
                    <button id="add-schedule-time" type="button">Add</button>
                    <button id="save-schedule" type="button">Save Time</button>
                    <div><br></div>
                    <div id="schedule-times">
                        <!-- Time inputs will be added here dynamically -->
                    </div>
                </form>

                <table id="schedule-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Fish Name</th>
                            <th>Schedule</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;

            document.getElementById("add-schedule-time").addEventListener("click", addScheduleTimeInput);
            document.getElementById("save-schedule").addEventListener("click", async function() {
                await saveSchedule();
            });

            await loadSchedules();
        }

        // Function to add schedule time input fields
        function addScheduleTimeInput() {
            const scheduleTimesDiv = document.getElementById('schedule-times');
            const timeInputCount = scheduleTimesDiv.children.length;

            if (timeInputCount >= 5) return; // Limit to 5 time inputs
            const timeInputDiv = document.createElement('div');
            timeInputDiv.classList.add('time-input');
            timeInputDiv.innerHTML = `
                <select class="hour-input" required>
                    ${Array.from({ length: 24 }, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>:
                <select class="minute-input" required>
                    ${Array.from({ length: 60 }, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>:
                <select class="second-input" required>
                    ${Array.from({ length: 60 }, (_, i) => `<option value="${String(i).padStart(2, '0')}">${String(i).padStart(2, '0')}</option>`).join('')}
                </select>
            `;
            scheduleTimesDiv.appendChild(timeInputDiv);
        }

        // Function to save schedule to Firebase
        async function saveSchedule() {
            const fishNameInput = document.getElementById('fish-name-input-schedule');
            const scheduleTimesDiv = document.getElementById('schedule-times');
            const timeInputs = scheduleTimesDiv.querySelectorAll('.time-input');
    
            const newFishName = fishNameInput.value.trim();
            const scheduleTimes = Array.from(timeInputs).map(timeInputDiv => {
                const hour = timeInputDiv.querySelector('.hour-input').value;
                const minute = timeInputDiv.querySelector('.minute-input').value;
                const second = timeInputDiv.querySelector('.second-input').value;
                return `${hour}:${minute}:${second}`;
            });

            if (newFishName === "" || scheduleTimes.length === 0) return;

            const scheduleRef = ref(database, `dashboard/schedule/${newFishName}`);
            const schedules = {};
            scheduleTimes.forEach((time, index) => {
                schedules[`schedule ${index + 1}`] = time;
            });

            await set(scheduleRef, schedules);

            fishNameInput.value = "";
            scheduleTimesDiv.innerHTML = "";

            await loadSchedules();
        }

        // Function to load schedules from Firebase
        async function loadSchedules() {
            const scheduleRef = ref(database, 'dashboard/schedule');
            const snapshot = await get(scheduleRef);
            const schedules = snapshot.val();
            const scheduleTableBody = document.querySelector('#schedule-table tbody');
            scheduleTableBody.innerHTML = "";

            if (schedules) {
                const keys = Object.keys(schedules);
                keys.forEach((key, index) => {
                    const scheduleTimes = schedules[key];
                    const scheduleText = Object.values(scheduleTimes).join(', ');
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${key}</td>
                        <td>${scheduleText}</td>
                        <td><button id="delete-schedule-${key}">Delete</button></td>
                    `;
                    scheduleTableBody.appendChild(row);
                });

                keys.forEach((key) => {
                    document.getElementById(`delete-schedule-${key}`).addEventListener("click", async function() {
                        await deleteSchedule(key);
                        await loadSchedules();
                    });
                });
            }
        }

        // Function to delete schedule from Firebase
        async function deleteSchedule(key) {
            const scheduleRef = ref(database, `dashboard/schedule/${key}`);
            await remove(scheduleRef);
        }

        // Function to show Food Leftover user content
        async function showFoodleftover() {
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>Food Leftover</h2>
                <table id="foodleftover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Time</th>
                            <th>Food Leftovers (%)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            `;

            await loadFoodleftover();
        }

        async function loadFoodleftover() {
            const foodRef = ref(database, 'dashboard/food-leftovers');
            const snapshot = await get(foodRef);
            const food = snapshot.val();
            const foodTableBody = document.querySelector('#foodleftover tbody');
            foodTableBody.innerHTML = "";

            if (food) {
                const keys = Object.keys(food);
                keys.forEach((key, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${key}</td>
                        <td>${food[key]}</td>
                        <td><button id="delete-food-leftovers-${key}">Delete</button></td>
                    `;
                    foodTableBody.appendChild(row);
                });

                keys.forEach((key) => {
                    document.getElementById(`delete-food-leftovers-${key}`).addEventListener("click", async function() {
                        await deleteFoodLeftOver(key);
                        await loadFoodleftover();
                    });
                });                
            }
        }

        // Function to delete user from Firebase
        async function deleteFoodLeftOver(key) {
            const foodRef = ref(database, `dashboard/food-leftovers/${key}`);
            await remove(foodRef);
        }

        showDashboard(); // Show dashboard by default