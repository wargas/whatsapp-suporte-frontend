import { useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from './providers/auth';
import { ChatScreen, LoginScreen } from './screens/';

export function Routes() {
  const { user } = useAuth();
  const { push } = useHistory()

  useEffect(() => {
    if(!user) {
        push('/login')
    }
  }, [user])

  return (
    <>
      <Switch>
        <Route exact path='/login' component={LoginScreen} />
        <Route exact path='/chat/:chat_id' component={ChatScreen} />
        <Route exact path='/chat' component={ChatScreen} />
        <Route exact path='/'>
          <Redirect to='/chat' />
        </Route>
      </Switch>
    </>
  );
}
