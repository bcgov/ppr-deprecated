import { computed, ref } from '@vue/composition-api'

function getDefs() {

  const currentUserIndex = ref(-1)
  const userList = ref(UserList())
  const authenticated = computed((): boolean => currentUserIndex.value >= 0)

  const currentUser = computed(() => {
    if (currentUserIndex.value>=0)
      return userList.value[currentUserIndex.value]
    return undefined
  })

  function setUser(index) {
    currentUserIndex.value = index
    const str = `${currentUserIndex.value}`
    console.log('store ', str)
    sessionStorage.setItem('user', str)
  }
  function logout() {
    currentUserIndex.value = -1
    sessionStorage.removeItem('user')
  }
  return {
    authenticated,
    currentUserIndex,
    currentUser,
    logout,
    setUser,
    userList
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}


export function useUsers () {
  return Instance()
}

export interface UserInterface {
  index: number;
  name: string;
  last: string
  company: string;
  occupation: string;
}


export function UserList() {
  let _cnt = 0;
  return [
    {
      index: _cnt++,
      name: 'Darlene',
      last: 'Dunn',
      company:'Dye and Durham',
      occupation: "Agent"
    },
    {
      index: _cnt++,
      name: 'Laylee',
      last: 'Lone',
      company:'Big Bank',
      occupation: "Loan Officer"
    },
    {
      index: _cnt++,
      name: 'John',
      last: 'Jones',
      company:'Midsized Law',
      occupation: "Conveyance Lawyer"
    },
    {
      index: _cnt++,
      name: 'Andrew',
      last: 'Lodge',
      company:"Andrew's Used Cars",
      occupation: "Use Care Dealer"
    },
    {
      index: _cnt++,
      name: 'Sarah',
      last: 'Sawyer',
      company:"Service BC",
      occupation: "Customer Care Representative"
    },
  ]
}
