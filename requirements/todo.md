# NODE / EXPRESS API 💫

Build REST API using Node.js/Express/Typescript



## Data Models Consideration

### Profile

A `profile` can be:
 -  `client` or 
 -  `contractor`.  

Clients create contracts with contractors, while contractors perform jobs for clients and get paid.  
Each profile has a balance property.

### Contract

A client-contractor agreement defines a contract. 
Each contract maintains one of three statuses: `new`, `in_progress`, or `terminated`.
Only contracts with an `in_progress` status are considered active.
Contracts serve to group related jobs.

### Job

Contractors get paid for jobs performed under a certain contract by clients.

## Technical Notes

### Header Authentication
- Users are authenticated by passing `profile_id` in the request header.
  Ensure that only users associated with a contract can access their respective contracts.

### APIs Requirements

#### Contract API
- **GET** `/contracts/:id` - Return the contract only if it belongs to the profile making the request.
- **GET** `/contracts` - Returns a list of contracts belonging to a user (client or contractor). The list should only contain non-terminated contracts.


#### Job API
-  **GET** `/jobs/unpaid` - Get all unpaid jobs for a user (**either** a client or contractor), but only for **active contracts**.
-  **POST** `/jobs/:job_id/pay` - Pay for a job. A client can only pay if their balance is greater than or equal to the amount due. The payment amount should be moved from the client's balance to the contractor's balance.


#### Misc API

-  **POST** `/balances/deposit/:userId` - Deposit money into a client's balance. A client cannot deposit more than 25% of the total of jobs to pay at the time of deposit.
-  **GET** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contractor who worked within the specified time range.
-  **GET** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - Returns the clients who paid the most for jobs within the specified time period. The `limit` query parameter should be applied, and the default limit is 2.

```json
[
    {
        "id": 1,
        "fullName": "Azeem Chauhan",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Mr Zombie",
        "paid" : 99
    }
]
```

