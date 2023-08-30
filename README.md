
# pAID - Tickets Trade Project

This project is a Tickets Trade system built using Nest.js as the framework language (Node.js) and MongoDB as the database.

# Initialization

```bash
  docker build -t <image_name> .

  docker run -p <host_port>:<container_port> --name <container_name> <image_name>
```



## Routes
The project consists of the following route prefixes:

- **Users**: Handles user-related operations such as user creation and verification.
- **Tickets**: Manages ticket-related operations such as adding new tickets, retrieving tickets by user, and trading tickets.
- **Credits**: Handles operations related to credits, such as adding credits to a user's account.
- **Trades**: Manages trade-related operations, including trade creation, finding trades by user, and finding trades by ID.

## Requirements

### Necessary

- NEST **2.3.0**
- Node.js **13.0.0**
- MongoDB **7.0.5**


## Api Route Details

## Tickets

#### Add a new ticket

```http
  POST /tickets/new/{user_id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_id` | `string` | **Required**. Registered user  |

#### Example Value | Schema

```bash
  {
    title:"string",
    category:"string",
    price:number,
    plataform:"string",
    description:"string",
    dateEvent: Date
  }
```

#### Get tickets by user

```http
  GET  /tickets/{user_id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `user_id` | `string` | **Required**. Registered user in sistem |

#### Trade a ticket

```http
  POST /tickets/trade
```
#### Example Value Schema

```bash
  {
    emailBuyer:"string",
    emailSaller:"string",
    ticketId:"string"
  }
```

## Trades

#### Get all trades by user

```http
  GET /trades/{user_id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_id` | `string` | **Required**. Registered user  |

## Credits

#### Add credits in a user

```http
  POST /credits/{user_id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_id` | `string` | **Required**. Registered user  |

#### Example Value Schema

```bash
  {
    value:number,
    payment:{
        "method":"string",
        "installment":number
    }
  }
```

