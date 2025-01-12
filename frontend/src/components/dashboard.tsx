import { useNavigate } from 'react-router-dom'
import Posts from './posts';

import UserInfo from './userInfo';
import SuggestedUsers from './suggestedUsers';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/recoil/user';

const dashboard = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  return (
    <div className='flex'>
      <Posts/>
      <div>
        ljasdljljs
        <UserInfo userId={user?.id} />
        <SuggestedUsers userId={user?.id} />
      </div>
    </div>
  )
}

export default dashboard
