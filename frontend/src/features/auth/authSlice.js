import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit'
import authService from './authService'
// NOTE: use a extractErrorMessage function to save some repetition
import { extractErrorMessage } from '../../utils'

// Get user from localstorage
const user = JSON.parse(localStorage.getItem('user'))

// NOTE: remove isSuccess from state as we can infer from
// presence or absence of user
// There is no need for a reset function as we can do this in our pending cases
// No need for isError or message as we can catch the AsyncThunkAction rejection
// in our component and we will have the error message there
const initialState = {
  user: user ? user : null,
  isLoading: false,
}

// Register new user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(extractErrorMessage(error))
    }
  }
)

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// Demote user
export const demote = createAsyncThunk('auth/demote', async (adminId, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.demote(adminId, token)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// Logout user
// NOTE: here we don't need a thunk as we are not doing anything async so we can
// use a createAction instead
export const logout = createAction('auth/logout', () => {
  authService.logout()
  // return an empty object as our payload as we don't need a payload but the
  // prepare function requires a payload return
  return {}
})

// NOTE: in cases of login or register pending or rejected then user will
// already be null so no need to set to null in these cases

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(login.pending, (state) => {
        state.isLoading = false
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoading = false
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getAdmins.pending, (state) => {
        state.isLoading = false
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.admins = action.payload
        state.isLoading = false
      })
      .addCase(getAdmins.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = false
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.allusers = action.payload
        state.isLoading = false
      })
      .addCase(getUsers.rejected, (state) => {
        state.isLoading = false
      })
  },
})

// Get admins
export const getAdmins = createAsyncThunk('auth/admins', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.admins(token)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

// Get users
export const getUsers = createAsyncThunk('auth/users', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token
    return await authService.users(token)
  } catch (error) {
    return thunkAPI.rejectWithValue(extractErrorMessage(error))
  }
})

export default authSlice.reducer
