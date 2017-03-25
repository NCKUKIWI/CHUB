# API document

## User

### GET /user/

#### Request

| Query | Requirement | Type |
|----------|:-------------:|------:|
| talent   |  option  | string |
| major    |  option  | string |

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

[
  "errormsg1",
  "errormsg2",
  "errormsg3"
]

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
