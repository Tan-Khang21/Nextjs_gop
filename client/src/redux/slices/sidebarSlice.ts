import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSidebarMenu, SidebarItem } from "@/api/sidebarApi";

export const fetchSidebarMenu = createAsyncThunk(
  "sidebar/fetchMenu",
  async () => {
    const data = await getSidebarMenu();
    return data;
  }
);

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    menu: [] as SidebarItem[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSidebarMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(fetchSidebarMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fetch failed";
      });
  },
});

export default sidebarSlice.reducer;
