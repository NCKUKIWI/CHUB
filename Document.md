# API document

## How to pass parameter

### Body

```js
$.ajax({
	type: "HTTP Method",
	url: "/eample",
	data:{
    		parameter1:"value1",
    		parameter2:"value2"
  	},
	success: function(response) {
    		//Deal with response
	}
});
```

### Query

```js
$.ajax({
	type: "HTTP Method",
	url: "/example?parameter1=value1&parameter2=value2",
	success: function(response) {
    		//Deal with response
	}
});
```

### Params

```js
$.ajax({
	type: "HTTP Method",
	url: "/example/parameter",
	success: function(response) {
    		//Deal with response
	}
});
```

## User

### POST /users/loginStatus

To check whether the session is login

#### Response

##### If session is login

```js
{
  me:{
    UserID:"UserID",
    Email:"Email",
    Name:"name",
    Major:"major",
    Talent:["talent"],
    Description:"description",
    Website:"website",
    Role:"role"
  }
}
```

##### Not login

```js
{
	error:"notLogin"
}
```

- - -

### GET /users/

Get all users

#### Request

| Query | Requirement | Type |
|----------|:-------------:|------:|
| talent   |  option  | string |
| major    |  option  | string |

#### Response

```js
{
  users:[{
    UserID:"UserID",
    Email:"Email",
    Name:"name",
    Major:"major",
    Talent:["talent"],
    Description:"description",
    Website:"website",
    Role:"role"
  }]
}
```

- - -

### POST /users/signup

Create a user in db

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| userid   |  require  | string |
| pw       |  require  | string |
| name     |  require  | string |
| email    |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /users/auth

Login a user

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| userid   |  require  | string |
| pw       |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:"errormsg"
}
```

- - -

### POST /users/update

Update a user's data

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| userid   |  require  | string |
| major    |  require  | string |
| name     |  require  | string |
| email    |  require  | string |
| talent   |  require  | string |
| description   |  require  | string |
| website   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### GET /users/msg

Get user's message

Need login

#### Response

```js
{
  msg:[{
    FromID:"id",
    ToID:"id",
    Context:"context",
    IsRead:true,
    FromIDType:"FromIDType",
    ToIDType:"ToIDType",
    CreateAt:"CreateAt"
  }]
}
```

- - -

### GET /users/:id

Get one user's data

#### Request

| Query     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

```js
{
  user:{
    UserID:"UserID",
    Email:"Email",
    Name:"name",
    Major:"major",
    Talent:["talent"],
    Description:"description",
    Website:"website",
    Role:"role"
  }
}
```

##### Fail

```js
{
	error:"errormsg"
}
```

- - -

## Project

### GET /projects

Get all projects

#### Response

```js
{
	projects:[{
		Type:"type",
	  Time:["date"],
	  Goal:"goal",
	  Need:["need"],
	  Sponser:["sponser"],
	  Description:"description",
	  ApplyID:["applyid"],
	  MemberID:["memberid"],
	  AdminID:["adminid"],
	  GroupID:"groupid",
	  CreateAt:"createat"
	}]
}
```

- - -

### POST /projects/create/

Create a project

Need login

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| group_id  |  option  | string |
| name   |  require  | string |
| type   |  require  | string |
| time   |  require  | string split by , |
| goal   |  require  | string |
| need   |  require  | string split by , |
| description   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /projects/update/:id

Update a project

Need login

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| name   |  require  | string |
| type  |  require  | string |
| time  |  require  | string split by , |
| goal  |  require  | string |
| need  |  require  | string split by , |
| description  |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### GET /projects/:id/apply

Show the user that apply for the project

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

```js
{
	apply:[{
    UserID:"UserID",
    Email:"Email",
    Password:"pw",
    Name:"name",
    Major:"major",
    Talent:["talent"],
    Description:"description",
    Website:"website",
    Role:"role",
    CreateAt:"CreateAt"
  }]
}
```

##### Fail

```js
{
	error:"errormsg"
}
```

- - -

### POST /projects/join

That user join a project

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| project_id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /projects/quit

That user quit from a project

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| project_id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /projects/:id/addMember/:uid

Allow user join the project

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |
| uid   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /projects/:id/delMember/:uid

Delete member form the project

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |
| uid   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /projects/delete/:id

Delete a project

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:"errormsg1"
}
```

- - -

### GET /projects/:id

Get the infomation about the project

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

```js
{
	project:{
		Type:"type",
	  Time:["date"],
	  Goal:"goal",
	  Need:["need"],
	  Sponser:["sponser"],
	  Description:"description",
	  ApplyID:["applyid"],
	  MemberID:["memberid"],
	  AdminID:["adminid"],
	  GroupID:"groupid",
	  CreateAt:"createat"
	},
	comments:[{
		ProjectID:"ProjectID",
		Context:"context",
		PeopleID:"PeopleID",
		ResCommentID:"ResCommentID",
		CreateAt:"CreateAt"
	}],
	members:[{
	   UserID:"UserID",
	   Email:"Email",
	   Password:"pw",
	   Name:"name",
	   Major:"major",
	   Talent:["talent"],
	   Description:"description",
	   Website:"website",
	   Role:"role",
	   CreateAt:"CreateAt"
	 }]
}
```

##### Fail

```js
{
	error:"errormsg"
}
```

- - -

## Activity

### GET /activities

Get all activity

#### Response

```js
{
	activity:[{
		Type:"type",
		Description:"Description",
		Time:["time"],
		MemberID:["memberid"],
		AdminID:["adminid"],
		Context:"context",
		GroupID:["groupid"],
		CreateAt:"CreateAt"
	}]
}
```

- - -

### POST /activities/create

Need login

Create a activity

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| group_id  |  option  | string |
| name   |  require  | string |
| type   |  require  | string |
| description   |  require  | string |
| time   |  require  | string split by , |
| context   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /activities/update/:id

Update an activity

Need login

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| name   |  require  | string |
| type  |  require  | string |
| time  |  require  | string split by , |
| context  |  require  | string |
| description  |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /activities/join

Join an activity

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| activity_id   |  require  | string |
| user_id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

"notFound"

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /activities/quit

Quit from an activity

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| activity_id   |  require  | string |
| user_id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

"notFound"

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### GET /activities/:id

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
|  id   |  require  | string |

#### Response

##### Success

```js
{
	activity:{
		Type:"type",
		Description:"Description",
		Time:["time"],
		MemberID:["memberid"],
		AdminID:["adminid"],
		Context:"context",
		GroupID:["groupid"],
		CreateAt:"CreateAt"
	},
	comments:[{
		ProjectID:"ProjectID",
		Context:"context",
		PeopleID:"PeopleID",
		ResCommentID:"ResCommentID",
		CreateAt:"CreateAt"
	}],
	members:[{
	   UserID:"UserID",
	   Email:"Email",
	   Name:"name",
	   Major:"major",
	   Talent:["talent"],
	   Description:"description",
	   Website:"website",
	   Role:"role"
	 }]
}
```

##### Fail

```js
{
	error:"errormsg"
}
```

- - -

## Message

### POST /messages/send

Send message

need login

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| fromgid   |  option  | string |
| touid   |  option  | string |
| togid  |  option  | string |
| context   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:[
	  "errormsg1",
	  "errormsg2",
	  "errormsg3"
	]
}
```

- - -

### POST /messages/delete/:id

Delete message

need login

#### Request

| Query     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

"ok"

##### Fail

```js
{
	error:"errormsg1"
}
```
