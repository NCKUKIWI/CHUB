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

### GET /user/

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

### POST /user/signup

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| userid   |  require  | string |
| pw       |  require  | string |
| name     |  require  | string |
| email    |  require  | string |

#### Response

##### Success

"ok"

#### Fail

```js
[
  "errormsg1",
  "errormsg2",
  "errormsg3"
]
```

### POST /user/auth

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| userid   |  require  | string |
| pw       |  require  | string |

#### Response

##### Success

"ok"

#### Fail

"fail"

### POST /user/update

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

#### Fail

```js
[
  "errormsg1",
  "errormsg2",
  "errormsg3"
]
```

### GET /user/msg

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

### POST /user/msg/send

Need login

| Body     | Requirement | Type |
|----------|:-------------:|------:|
| toid   |  require  | string |
| context   |  require  | string |

#### Response

##### Success

"ok"

#### Fail

```js
[
  "errormsg1",
  "errormsg2",
  "errormsg3"
]
```

### POST /user/:id

| Query     | Requirement | Type |
|----------|:-------------:|------:|
| id   |  require  | string |

#### Response

##### Success

```js
{
  userInfo:{
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
  }
}
```

#### Fail

"noUser"
