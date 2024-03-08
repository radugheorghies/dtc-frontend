import Link from 'next/link';
import { useSignOut, useUser } from '../hooks/user';
import { useRouter } from 'next/router';

function NavBar() {
  const user = useUser();
  const signOut = useSignOut();
  const router = useRouter();

  // console.log('[NavBar] user role:', user?.role);
  return (
    <nav className="px-2 py-1 text-sm">
      <ul className="flex gap-2">
        <li className="text-lg font-extrabold">
          <Link href="/">
            Datecs Test Case
          </Link>
        </li>
        <li role="separator" className="flex-1" />
        {user ? (
          <>
            <li>
              <Link href="/nui-generator">
                NUI Generator |
              </Link>
            </li>
            <li>
              <Link href="/logs">
                Logs |
              </Link>
            </li>
            <li>
              <Link href="/certificates">
                Certificates |
              </Link>
            </li>
            {(user?.role==="admin"||user?.role==="super-admin")?(
              <li>
                <Link href="/users">
                  Users |
                </Link>
              </li>
            ):null}
            <li className='text-green-600'>
              {user ? (
                <>Hello {user.name}</>
                ):(null)
              }
            </li>
            <li>
              <button onClick={()=>{
                signOut();
                router.push("/")
              }}>
                Sign Out ?
              </button>
            </li>
          </>
        ) : null}
      </ul>
    </nav>
  );
}

export default NavBar;
