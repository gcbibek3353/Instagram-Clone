import SideBar from './sideBar'
import { useRecoilValue } from 'recoil'
import { userAtom } from '@/recoil/user'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    const user = useRecoilValue(userAtom);
    
  return (
    <div className='flex gap-10'>
      <SideBar userId={user?.id} />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
