import { computed, ref } from '@vue/composition-api'

console.log('import see this once set up users')


function getDefs() {

  console.log('Should see this once define users')

  const currentUserIndex = ref(-1)
  const userList = ref(UserList())
  const authenticated = computed((): boolean => currentUserIndex.value >= 0)

  // originally computed property
  const currentUser = computed(() => {
    if (currentUserIndex.value>=0)
      return userList.value[currentUserIndex.value]
    return undefined
  })

  return {
    authenticated,
    currentUserIndex,
    currentUser,
    userList
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}


export function useUsers () {
  console.log('useUsers')

  const rval =  Instance()
  console.log('useUsers', rval)

  return rval
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
