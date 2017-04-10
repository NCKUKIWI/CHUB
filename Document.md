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

### POST /user/loginStatus

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

### GET /user/

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

### POST /user/signup

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

### POST /user/auth

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

### POST /user/update

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

### GET /user/msg

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

### POST /user/msg/send

Send message to a user

Need login

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| toid   |  require  | string |
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

### GET /user/:id

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

## Comment

### POST /comment/creat/

Create a comment to project or activity

Need login

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| project_id    |  option  | string |
| activity_id   |  option  | string |
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

### POST /comment/update/:id

Update the context of comment

Need login

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id    |  require  | string |

| Body     | Requirement | Type |
|----------|:-------------:|------:|
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

### POST /comment/delete/:id

Delete one comment

Need login

#### Request

| Params     | Requirement | Type |
|----------|:-------------:|------:|
| id    |  require  | string |

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

### GET /project

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

### POST /project/create/

Create a project

Need login

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
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

### POST /project/update/:id

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

### GET /project/:id/apply

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

### POST /project/join

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

### POST /project/quit

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

### POST /project/:id/addMember/:uid

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

### POST /project/:id/delMember/:uid

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

### POST /project/delete/:id

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

### GET /project/:id

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

### GET /activity

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

### POST /activity/create

Need login

Create a activity

#### Request

| Body     | Requirement | Type |
|----------|:-------------:|------:|
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

### POST /activity/update/:id

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

### POST /activity/join

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

### POST /activity/quit

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

### GET /activity/:id

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
