import { computed, ref } from '@vue/composition-api'
import { usePartyCodes, PartyCodeInterface } from '@/party-code/party-code-model'

export enum Roles {
  None = "no user",
  User = "User",
  SP = "Securing Party",
  RP = "Registering Agent",
  Tax = "Tax",
  Staff = "PPR Staff",
  Admin = "Admin"
}

const AdminRoles = [  Roles.Admin ]
const DashboardUserRoles = [ Roles.Staff, Roles.SP, Roles.RP ]
const RegisterRoles = [ Roles.SP, Roles.RP, Roles.Tax ]

export interface UserInterface {
  userId: string;
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
    let cUser
    let userId = currentUserIndex.value
    const stashedUser = sessionStorage.getItem('user')
    if (stashedUser) {
      userId = stashedUser
    }
    if (userId !== noUserIndex.value)
      cUser = userList.value.find( e => e.userId === userId)
    return cUser
  })

  const currentRole = computed( (): Roles => currentUser.value ? currentUser.value.role : Roles.None)
  const canAdmin = computed((): boolean => AdminRoles.includes(currentRole.value))
  const canDash = computed((): boolean => DashboardUserRoles.includes(currentRole.value))
  const canRegister = computed((): boolean => RegisterRoles.includes(currentRole.value))

  function setUser(userId): void {
    currentUserIndex.value = userId
    sessionStorage.setItem('user', userId)
  }

  function restoreUserFromStash() {
    const stashedUser = sessionStorage.getItem('user')
    if (stashedUser) {
      setUser(stashedUser)
    }

  }
  function logout(): void {
    currentUserIndex.value = noUserIndex.value
    sessionStorage.removeItem('user')
  }


  return {
    authenticated,
    canAdmin,
    canDash,
    canRegister,
    currentRole,
    currentUserIndex,
    currentUser,
    logout,
    noUserIndex,
    restoreUserFromStash,
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

/**
 * Create the initial prototype list of users. Match the company names to the client code business names so the
 * system can link the users to client codes.
 *
 * @return {UserInterface[]}
 * @constructor
 */
function UserList(): UserInterface[] {
  let _cnt = 0
  const list: UserInterface[] = [
    {
      userId: 'user' + _cnt++,
      name: 'Darlene',
      last: 'Dunn',
      company:'Dye and Durham',
      occupation: "Professional Services",
      role: Roles.RP,
      description: "Professional services"
    },
    {
      userId: 'user' + _cnt++,
      name: 'Laylee',
      last: 'Lorn',
      company:'Dye and Durham',
      occupation: "Conveyance Lawyer",
      role: Roles.RP,
      description: "Mainly does searches, and a few registrations, discharges, amendments"
    },
    {
      userId: 'user' + _cnt++,
      name: 'Adam',
      last: 'Minister',
      company:"Big Bank", // same as John Jones
      occupation: "Administrator",
      role: Roles.SP
    },
    {
      userId: 'user' + _cnt++,
      name: 'John',
      last: 'Jones',
      company:'Big Bank',
      occupation: "Loan Officer",
      role: Roles.SP
    },
    {
      userId: 'user' + _cnt++,
      name: 'Andrew',
      last: 'Lodge',
      company:"Andrew's Used Cars",
      occupation: "Use Care Dealer",
      role: Roles.User
    },
    {
      userId: 'user' + _cnt++,
      name: 'Sarah',
      last: 'Sawyer',
      company:"BC Registries",
      occupation: "Customer Care Representative",
      role: Roles.Staff
    },
    {
      userId: 'user' + _cnt++,
      name: 'Super',
      last: 'User',
      company:"Prototype explorer",
      occupation: "Contributor to the PPR project",
      role: Roles.Admin
    },
  ]
  return list
}
