# Physics Wallah Backed Intern Assignment

## Problem statement

In this problem we’ll create a micro-service to address some functionality which is useful to
derive simplified summary statistics (mean, min, max) on a dataset. The dataset that you’ll be
working with can be found later in the document and yes, it’s been kept very simple by design.
In our view, depending on your speed and how elegantly you want to solve this problem, it could
take you anywhere between 2 - 4 hours to implement this.
NOTE: Whenever we mention <SS> we mean summary statistics which essentially means 3
values (mean, min, max)
For this assignment, we are looking for following functionality to be implemented:
1. An API to add a new record to the dataset.
2. An API to delete a new record to the dataset.
3. An API to fetch SS for salary over the entire dataset. You can ignore the currency (if not
mentioned otherwise) of the salary and simply treat salary as a number.
4. An API to fetch SS for salary for records which satisfy "on_contract": "true".
5. An API to fetch SS for salary for each department. This means that whatever you’ll do in
Step 3, should be done for each department. The return of this API should have 1 SS
available for each unique department.
6. An API to fetch SS for salary for each department and sub-department combination. This
is similar to Case 5 but 1 level of nested aggregation.


## Requirements to Run and Test
- Node (v 16 above)
- Npm (v-8 above)
- Postman Desktop Client (to Test API)

## Packages and Tech Stack Used.
- Node and Express- Create the Server.
- MongoDB/Mongoose - As Database and Schema
- Joi- Validating Requests
- bcryptjs - Encrypting Password.
- jsonwebtoken- for authorization token.
- nodemon and colors to ehnace the development process.


## Setup

- Unzip the folder or clone from github.
  ```
  git clone https://github.com/chaitak-gorai/pw_assignment.git
  ```
- open the folder in any ide or use terminal
- mode into the folder
  ```
  cd .\pw_assignment\
  ```
- run the command to install all dependencies
  ```
  npm install
  ```
- Run the server
  ```
  npm run server
  ```
  Note: Your 3000 (default) port should be available or you can change the port in `.env` file
- Go to `http://localhost:3000/` to check whether the API is running or not.

## Test the API 
Note: You Must Have Postman Desktop CLient or any other API running client

- Open the workspace in Postman
  ```
  https://www.postman.com/bold-desert-26005/workspace/pw/collection/24415798-bc63e766-7274-4901-88b2-b74e853855c8?action=share&creator=24415798
  ```
- File Structure in Workspace
  ![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/b74e2a59-d9e2-4632-aece-1efbab4e2df2)
  
  Here we have `user` and `employee` section. The user seciton will be used to login and register the admin and the employee section have all the routes for the assignment.

  Click on the collection name ie `PW_assignment` to get into overview. Move to `Variables` tab to check the `LOCAL_URL` and `TOKEN`.
  ![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/a51f2524-905f-40f1-ae78-cba96e229792)


- Register User
  Create a user by hitting the route `http://localhost:3000/user/register` as `POST` request and with `userName` and `password` as JSON in body as shown in the image below.
  ![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/e9e194b3-e09a-4fed-9204-2597f9ab238e)

- Login User
  Similaryly Login the user with the login route as shown in the image.
  ![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/af3ef483-41bd-4a4d-807f-ef9d3faf5760)

  You will recieve an authorization token. Here i have used `JWT` Token.
  Copy the token and put into `Varibales` of the collection. This will be required to access further API's.

# Task Solutions:
- I have use a MVC achitechture with Model, Controllers and Routes for their specific work.
- `controllers/employeeController.js` have most of the core logic for the tasks.
- I have used a sepate util `GenerateResponse` to create a reponse as it makes the code clean.
- Similarly a seperate function to genrate a JWT token.
- a `Auth` middleware is used for protected routes which validates the authorization token.
- I have used aggregrate function from mongodb to prepare the desired solution.

  
## Task 1: An API to add a new record to the dataset.
Move inside the employee seciton and use the `addEmployee` route to add a employe with details.
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/dd2c51b5-0523-4935-8ccb-3f3ad8301bb0)

You can get all Employees by using the `/employee/all` route.
Here, the initial json data is already added to the database.

## Task 2: An API to delete a new record to the dataset.
To delete a employee use the `employee/remove` route. Provide the id in the body of the request.
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/9709184e-f423-4e03-86bc-dc907a76f5d0)

## Task 3: An API to fetch SS for salary over the entire dataset. You can ignore the currency (if not
mentioned otherwise) of the salary and simply treat salary as a number.
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/ff35f7d8-be41-40ea-bb76-c09b03f1a244)

Core logic:
```
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
```
Here i have used the aggregate function of mongoose to calculate the mean, min, max of the entire dataset.

### Alternate Solution:
- We can have two data fields to store the total salary and no of employees.
- Each time a data is added or removed these two variable will be updated.
- So when SS is requrired we can fetch it in O(1) constant time.

## Task 4:  An API to fetch SS for salary for records which satisfy "on_contract": "true".
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/f661b063-51dd-47aa-a690-731aa773df5f)

Core logic:
```
const result = await Employee.aggregate([
      {
        $match: {
          on_contract: true,
        },
      },
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
```
Used the aggregrate function with `match` here the on_contract key is matched for each data and if it is true the data is returned.
Here also can use the alternate solution of storing different variable of the total salary count for on_contract employess.

## Task 5: An API to fetch SS for salary for each department.  
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/b843e817-95a5-4747-9368-af55e96ac10c)

Core Logic:
```
 const result = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
```
Here the data is grouped by department key and the SS for each department is returned.

## Task 6: An API to fetch SS for salary for each department and sub-department combination.
![image](https://github.com/chaitak-gorai/pw_assignment/assets/77141674/98bca892-00f7-4a6e-a488-95e88310af54)

Core Logic:
```
  const result = await Employee.aggregate([
      {
        $group: {
          _id: {
            department: '$department',
            sub_department: '$sub_department',
          },
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
      {
        $group: {
          _id: '$_id.department',
          sub_departments: {
            $push: {
              sub_department: '$_id.sub_department',
              avgSalary: '$avgSalary',
              minSalary: '$minSalary',
              maxSalary: '$maxSalary',
            },
          },
        },
      },
    ])
```
Here a more conmplex version of the aggregrate function is used where at first i am grouing the data on the basis of department and sub_department and then pushing the SS for each sub_deparment.

Here are the solutions for all the tasks. I have also used proper error codes and authorizatioin for the API routes.

## Thank You 




  







  

  


  

  

