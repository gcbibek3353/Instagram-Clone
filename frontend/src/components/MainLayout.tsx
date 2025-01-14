import SideBar from './sideBar'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/recoil/user'
import { Outlet } from 'react-router-dom'
import UserInfo from './userInfo';
import SuggestedUsers from './suggestedUsers';

const MainLayout = () => {
    const user = useRecoilValue(userAtom);
    
  return (
    <div className='flex gap-10 justify-between'>
      <SideBar userId={user?.id} />
      <div>
        <Outlet />  
      </div>
      <div className='h-screen p-3 sticky top-10 right-10 w-1/3'>
        <UserInfo userId={user?.id} />
        <SuggestedUsers />
      </div>

    </div>
  )
}

export default MainLayout
