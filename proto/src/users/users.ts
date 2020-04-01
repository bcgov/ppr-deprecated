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

const AdminRoles = [ Roles.SPAdmin, Roles.Staff]
const SuperRoles = [ Roles.Admin]
const PowerUserRoles = [ Roles.Staff, Roles.SP, Roles.SPAdmin, Roles.Admin, Roles.RP ]

export interface UserInterface {
  userId: number;
  name: string;
  last: string;
  company: string;
  occupation: string;
  role: Roles;
  description?: string;
  party?: PartyCodeInterface;
}

function getDefs() {

  const noUserIndex = ref('')
  const currentUserIndex = ref(noUserIndex.value)

  /**
   * Create list of users.  Insert their party codes.
   */
  const { findPartyByCompanyName } = usePartyCodes()
  const list = UserList()
  list.forEach( (user: UserInterface) => {
    const party: PartyCodeInterface = findPartyByCompanyName(user.company)
    if(party) {
      user.party = party
    }
  })
  // export the list of users
  const userList = ref(list)

  const authenticated = computed((): boolean => currentUserIndex.value !== noUserIndex.value)

  const currentUser = computed((): UserInterface | undefined => {
    let userId = currentUserIndex.value
    const stashedUser = sessionStorage.getItem('user')
    if (stashedUser) {
      userId = stashedUser
    }
    if (userId !== noUserIndex.value)
      return userList.value[userId]
    return undefined
  })

  const currentRole = computed( (): Roles => currentUser.value ? currentUser.value.role : Roles.None)
  const canAdmin = computed((): boolean => AdminRoles.includes(currentRole.value))
  const canDash = computed((): boolean => PowerUserRoles.includes(currentRole.value))
  const canSuper = computed((): boolean => SuperRoles.includes(currentRole.value))

  function setUser(userId): void {
    currentUserIndex.value = userId
    const str = `${currentUserIndex.value}`
    sessionStorage.setItem('user', str)
  }
  function logout(): void {
    currentUserIndex.value = noUserIndex.value
    sessionStorage.removeItem('user')
  }

  return {
    authenticated,
    canAdmin,
    canDash,
    canSuper,
    currentRole,
    currentUserIndex,
    currentUser,
    logout,
    noUserIndex,
    setUser,
    userList
  }
}

const instance = {_instance: undefined}
function Instance() {
  return instance._instance || (instance._instance = getDefs())
}

export function useUsers() {
  return Instance()
}

function UserList(): UserInterface[] {
  let _cnt = 0
  const list = [
    {
      userId: _cnt++,
      name: 'Darlene',
      last: 'Dunn',
      company:'Dye and Durham',
      occupation: "Professional Services",
      role: Roles.RP,
      description: "Professional services"

    },
    {
      userId: _cnt++,
      name: 'Laylee',
      last: 'Lorn',
      company:'Dye and Durham',
      occupation: "Conveyance Lawyer",
      role: Roles.RP,
      description: "Mainly does searches, and a few registrations, discharges, amendments"
    },
    {
      userId: _cnt++,
      name: 'Adam',
      last: 'Minister',
      company:"Big Bank", // same as John Jones
      occupation: "Administrator",
      role: Roles.SPAdmin
    },
    {
      userId: _cnt++,
      name: 'John',
      last: 'Jones',
      company:'Big Bank',
      occupation: "Loan Officer",
      role: Roles.SP
    },
    {
      userId: _cnt++,
      name: 'Andrew',
      last: 'Lodge',
      company:"Andrew's Used Cars",
      occupation: "Use Care Dealer",
      role: Roles.User
    },
    {
      userId: _cnt++,
      name: 'Sarah',
      last: 'Sawyer',
      company:"BC Registries",
      occupation: "Customer Care Representative",
      role: Roles.Staff
    },
    {
      userId: _cnt++,
      name: 'Super',
      last: 'User',
      company:"Prototype explorer",
      occupation: "Contributor to the PPR project",
      role: Roles.Admin
    },
  ]
  return list
}
