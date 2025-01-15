import SideBar from './sideBar'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/recoil/user'
import { Outlet } from 'react-router-dom'
import UserInfo from './userInfo';
import SuggestedUsers from './suggestedUsers';

const MainLayout = () => {
    const user = useRecoilValue(userAtom);
    
  return (
    <div className='flex lg:gap-10 lg:justify-between justify-center'>
      <SideBar userId={user?.id} />
      <div>
        <Outlet />  
      </div>
      <div className='h-screen hidden lg:block p-3 sticky top-10 right-10 w-1/3'>
        <UserInfo userId={user?.id} />
        <SuggestedUsers />
      </div>

    </div>
  )
}

export default MainLayout
