import { computed, ref } from '@vue/composition-api'
import { usePartyCodes, PartyCodeInterface } from '../party-code/party-code-model'

export enum Roles {
  None = "no user",
  User = "User",
  SP = "SP",
  SPAdmin = "SPAdmin",
  RP = "RP",
  Tax = "Tax",
  Staff = "PPR Staff",
  Admin = "Admin"
}

const AdminRoles = [ Roles.SPAdmin, Roles.Staff, Roles.Admin]
const PowerUserRoles = [ Roles.Staff, Roles.SP, Roles.SPAdmin, Roles.Admin, Roles.RP ]

export interface UserInterface {
  index: number;
  name: string;
  last: string
  company: string;
  occupation: string;
  role: Roles;
  description?: string;
  party?: PartyCodeInterface
}

function getDefs() {

  const currentUserIndex = ref(-1)

  const { findPartyCodeByCompanyName } = usePartyCodes()
  const list = UserList()
  list.forEach( (user: UserInterface) => {
    const code: PartyCodeInterface = findPartyCodeByCompanyName(user.company)
    if(code) {
      user.party = code
    }
  })
  const userList = ref(list)

  const authenticated = computed((): boolean => currentUserIndex.value >= 0)

  const currentUser = computed((): UserInterface | undefined => {
    if (currentUserIndex.value>=0)
      return userList.value[currentUserIndex.value]
    return undefined
  })

  const currentRole = computed( () => currentUser.value ? currentUser.value.role : Roles.None)
  const canAdmin = computed((): boolean => AdminRoles.includes(currentRole.value))
  const canDash = computed((): boolean => PowerUserRoles.includes(currentRole.value))

  function setUser(index) {
    currentUserIndex.value = index
    const str = `${currentUserIndex.value}`
    sessionStorage.setItem('user', str)
  }
  function logout() {
    currentUserIndex.value = -1
    sessionStorage.removeItem('user')
  }

  return {
    authenticated,
    canAdmin,
    canDash,
    currentRole,
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

export function UserList(): UserInterface[] {
  let _cnt = 0;
  const list = [
    {
      index: _cnt++,
      name: 'Darlene',
      last: 'Dunn',
      company:'Dye and Durham',
      occupation: "Professional Services",
      role: Roles.RP,
      description: "Professional services"

    },
    {
      index: _cnt++,
      name: 'Laylee',
      last: 'Lorn',
      company:'Dye and Durham',
      occupation: "Conveyance Lawyer",
      role: Roles.RP,
      description: "Mainly does searches, and a few registrations, discharges, amendments"
    },
    {
      index: _cnt++,
      name: 'Adam',
      last: 'Minister',
      company:"Big Bank", // same as John Jones
      occupation: "Administrator",
      role: Roles.SPAdmin
    },
    {
      index: _cnt++,
      name: 'John',
      last: 'Jones',
      company:'Big Bank',
      occupation: "Loan Officer",
      role: Roles.SP
    },
    {
      index: _cnt++,
      name: 'Andrew',
      last: 'Lodge',
      company:"Andrew's Used Cars",
      occupation: "Use Care Dealer",
      role: Roles.User
    },
    {
      index: _cnt++,
      name: 'Sarah',
      last: 'Sawyer',
      company:"Service BC",
      occupation: "Customer Care Representative",
      role: Roles.Staff
    },
    {
      index: _cnt++,
      name: 'Super',
      last: 'User',
      company:"Prototype explorer",
      occupation: "Contributor to the PPR project",
      role: Roles.Admin
    },
  ]
  return list
}
