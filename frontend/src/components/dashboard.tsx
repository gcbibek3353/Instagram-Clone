import { useNavigate } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import Posts from './posts';

import UserInfo from './userInfo';
import SuggestedUsers from './suggestedUsers';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/user';

const dashboard = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  console.log(isAuthenticated);
  const user = useRecoilValue(userAtom);
  // console.log(user);
  // if(user.length >1){
  //   navigate('/signin');
  // }
  // if(!isAuthenticated){
  //   navigate('/signin')
  // }

  return (
    <div className='flex'>
      <Posts />
      <div>
        <UserInfo userId={user?.id} />
        <SuggestedUsers userId={user?.id} />
      </div>
    </div>
  )
}

export default dashboard
