

FORMAT: 1A
HOST: https://rocky-oasis-94549.herokuapp.com/

# Recognitdo

Recognitdo is a simple Restful facial detection api, that allows users to submit image urls, that will allows the application to detect a face withing the image, and generate a box surrounding the face.
Users are able to login/signUp, create an account, submit images to a PSQL database, which updates the users entries upon submission of the image. 

## Built With

 - Node - Run-time environment
 - Express - Web application framework
 - PSQL - Database
 - JWT - Authentication
 - Mocha - Testing
 - Chai - Testing
 - Clarafai API - Facial Recognition API


## Sign-In [/signin]

### Sign-In defalut user Endpoint [GET]

You may login using the default guest account, which sends a JSON object, containing a email, and password. 

+ Request (application/json)

        {
            "email": "guest@mail.com",
            "password": "123"
        }
        

+ Response 200 (application/json)

    + Body
    
            {
                    "id": 1,
                    "name": "guest",
                    "email": "guest@mail.com",
                    "entries": "13",
                    "joined": "2020-11-10T06:36:57.284Z"
            }

## Register [/register]


### Register Endpoint [POST]
You may register and create a new account using this endpoint. 

+ Request (application/json)

        {
            "email": "guest@mail.com",
            "password": "123"
        }
        

+ Response 200 (application/json)



## Image Endpoint [/image]


### Send an Image to update the users entries [PUT]

The request contains a JSON object containing, the users id, and a url image, that is to send to the server.
Allowing for that users entries to update. 

+ Request (application/json)

        {
            "email": "gust@email.com",
            "password": "123",
            "id": 1
        }

+ Response 201 (application/json)

    + Headers

           

    + Body

            [
                "14"
            ]
