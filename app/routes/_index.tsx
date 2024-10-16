import { LoaderFunctionArgs, json} from '@remix-run/cloudflare'
import { Form, useLoaderData, Link } from '@remix-run/react'
import { initializeAuth } from '../auth/auth.server'


export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const auth = initializeAuth(context.cloudflare.env);
  const user = await auth.getUser(request, context)
  // const { user, accessToken } = await auth.getUserWithAccessToken(request, context)
  const orgs = user?.getOrgs()
  const activeOrg = user?.getActiveOrg()
  const loginPage = auth.getLoginPageUrl()
  return json({ user: user, loginPage: loginPage, activeOrg: activeOrg, orgs: orgs })
}


export default function IndexRoute() {
  const { user, loginPage, activeOrg, orgs } = useLoaderData<typeof loader>()
  console.log('accessToken')

  // const setActiveOrg = (orgId: string) => {
  //   console.log(`Active org ID: ${orgId}`);
  //   fetcher.submit(
  //     { active_org_id: orgId },
  //     {
  //       method: "POST",
  //       encType: "application/json",
  //       action: "/api/auth/set-active-org",
  //       navigate: false,
  //     }
  //   );
  // };


  if (user && orgs) {
    return (
      <div>
      <h2>hello, {user.email}</h2>
      <Form method="post" action="/api/auth/logout">
        <button type="submit">Logout</button>
      </Form>
      <h2>Active Org: {activeOrg?.orgId}</h2>
      </div>
    )
  }

  else {
    return (
      <div>
        <h2>You are not logged in</h2>
        <Link to={loginPage}>
          <button>Login</button>
        </Link>

      </div>
    )
  }
}