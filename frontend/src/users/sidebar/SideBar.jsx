/* eslint-disable react/prop-types */
import SideBarList from "./SideBarList";

const SideBar = ({
  isSidebarVisible,
  setIsSidebarVisible,
  isMenu,
  setIsMenu,
}) => {
  return (
    <>
      <SideBarList
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
        isMenu={isMenu}
        setIsMenu={setIsMenu}
      />
    </>
  );
};

export default SideBar;
