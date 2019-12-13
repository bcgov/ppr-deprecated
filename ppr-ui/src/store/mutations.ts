export default {
  setLoading: (state, isLoading): void => {
    if (isLoading) {
      state.loadingCount++
    } else {
      state.loadingCount--
    }
    // intentional side effect to trigger reactive responses to change in loading state
    state.isLoading = state.loadingCount > 0
  }
}
