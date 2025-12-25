## Set up for the Project

    Node.js and MySQL should be installed:
    Node should be added in the PATH in environment variables.

### 1. Create the Database

    For MySQL command line or VS code terminal:

        ```sql
    mysql -u root -p
    ```

    Then execute the SQL file:
    ```sql
    source C:/Users/User/Desktop/chemflo/database.sql <-`path to the file destination`
    ```
    For MySQL Workbench and run:

    Manually copy and paste the contents of `database.sql` into MySQL.

### 2. Create Environment File

    Create a `.env` file in the root directory `C:\Users\User\Desktop\chemflo\.env` <-`path` with:

    ```
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password_here
    DB_NAME=chemflo_inventory
    ```

    **Note:** Replace `your_mysql_password_here` with your actual MySQL root password. If you're    using XAMPP and didn't set a password, leave it empty.

### 3. Install Backend Dependencies

    Open PowerShell in the project directory and run:

    ```powershell or cmd
    cd C:\Users\User\Desktop\chemflo <-'path of the root folder' 
    npm install
    ```

### 4. Start the Backend Server

    ```powershell or cmd
    npm start
    ```

    The backend should start on `http://localhost:5000`

### 5. Install Frontend Dependencies

    Open a **new** PowerShell window and run:

    ```powershell or cmd
    cd C:\Users\User\Desktop\chemflo\frontend <-'path to the frontend folder'
    npm install
    ```

### 6. Start the Frontend

    ```powershell or cmd
    npm start
    ```

    The frontend should open automatically in your browser at `http://localhost:3000`

## Troubleshooting

    ### "npm is not recognized"
    - Make sure Node.js is installed
    - **Close and reopen** your terminal/IDE
    - Check if Node.js is in your PATH environment variable

    ### "Cannot connect to MySQL"
    - Make sure MySQL is running
    - Check your `.env` file has the correct password
    - Verify MySQL is listening on port 3306 (default)

    ### Port already in use
    - Change the PORT in `.env` file
    - Or stop the application using that port

    ### Certificate not signed while running npm start in powershell
    - Run the same command in cmd terminal in the VS code


## Quick Start Commands Summary

    ```powershell or cmd
    # Terminal 1 - Backend
    cd C:\Users\User\Desktop\chemflo
    npm install
    npm start

    # Terminal 2 - Frontend (new window)
    cd C:\Users\User\Desktop\chemflo\frontend
    npm install
    npm start
    ```