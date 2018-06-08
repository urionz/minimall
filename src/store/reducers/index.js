import { combineReducers } from 'redux'
import home from './home'
import search from './search'
import video from './video'
import user from './user'

const initialState = {
    loading: false
}

export default combineReducers({
    home,
    search,
    video,
    user
})
