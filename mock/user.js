import Mock from 'mockjs'
const usersList = [
  {
    key: 'admin',
    name: 'admin',
    pass: 'admin',
    description: 'Super Administrator. Have access to view all pages.',
    roles: ['admin', 'editor', 'visitor']
  },
  {
    key: 'editor',
    name: 'editor',
    pass: 'editor',
    description: 'Normal Editor. Can see all pages except permission page',
    roles: ['editor', 'visitor']
  },
  {
    key: 'visitor',
    name: 'visitor',
    pass: 'visitor',
    description: 'Just a visitor. Can only see the home page and the document page',
    roles: ['visitor']
  }
]
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
  test: {
    token: 'tester-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  },
  'tester-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
}

export default [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      console.log('mock的userinfo接口的Token输出：' + token)
      // const info = users[token]
      const info = users['tester-token']
      console.log('mock出的info:' + JSON.stringify(info))
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // mock get all users form server
  {
    url: '/vue-element-admin/users',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: usersList
      }
    }
  },

  // add user
  {
    url: '/vue-element-admin/user',
    type: 'post',
    response: {
      code: 20000,
      data: {
        key: Mock.mock('@integer(300, 5000)')
      }
    }
  },

  // update user
  {
    url: '/vue-element-admin/user/[A-Za-z0-9]',
    type: 'put',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  },

  // delete user
  {
    url: '/vue-element-admin/user/[A-Za-z0-9]',
    type: 'delete',
    response: {
      code: 20000,
      data: {
        status: 'success'
      }
    }
  }
]
