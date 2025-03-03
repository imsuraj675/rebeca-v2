import React, { useState } from "react";
import { Avatar, Tabs, Space, Modal, Typography, Dropdown, notification, ConfigProvider, theme } from "antd";
import EventRegistration from "../EventAddition/EventAddition";
import MemberAddition from "../MemberAddition/MemberAddition";
import MemberEditing from "../MemberEditing/MemberEditing";
import RegistrationStats from "../RegistrationStats/RegistrationStats";
import EventEditing from "../EventEditing/EventEditing";
import { useAuth } from "../../AuthContext";
import { LogoutOutlined } from "@ant-design/icons";


const themeColor = {
    Organiser: "#ef7f29",
    Facilitator: "#9852f3",
    Member: "#1668dc",
};

const AvatarMenu = ({ admin, handleLogout }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const menuItems = [
        {
            key: "welcome",
            label: (
                <Space>
                    <Avatar
                        src={admin.image}
                        style={{
                            border: `2px solid ${themeColor[admin.role]}`,
                            width: 45,
                            height: 45,
                        }}
                    />
                    <div>
                        <Typography.Text strong>
                            {admin.name.split(" ")[0]}
                        </Typography.Text>
                        <br />
                        <Typography.Text style={{ color: themeColor[admin.role] }}>
                            {admin.role}
                        </Typography.Text>
                    </div>
                </Space>
            ),
        },
        { type: "divider" },
        {
            key: "logout",
            label: (
                <Space>
                    <LogoutOutlined />
                    Logout
                </Space>
            ),
            onClick: () => setIsModalVisible(true),
        },
    ];

    const handleConfirmLogout = () => {
        setIsModalVisible(false);
        handleLogout();
    };

    const handleCancelLogout = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
                <Avatar
                    src={admin.image}
                    alt={admin.name}
                    size={50}
                    style={{ cursor: "pointer" }}
                />
            </Dropdown>
            <Modal
                title="Confirm Logout"
                open={isModalVisible}
                onOk={handleConfirmLogout}
                onCancel={handleCancelLogout}
                okText="Logout"
                cancelText="Cancel"
                okType="danger"
                okButtonProps={{type: "primary"}}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
        </>
    );
};


const Dashboard = () => {
    const { admin, handleLogout } = useAuth();
    const colorPrimary = themeColor[admin.role] || "#1668dc";
    console.log(admin);
    console.log(colorPrimary);

    const [OpSelect, setOpSelect] = useState(1);
    const width = window.innerWidth;
    // console.log(width);
    const [notificationApi, contextHolder] = notification.useNotification();
    const infoPop = (e, message = "") => {
        notificationApi.open({
            message: message || "Information",
            type: "info",
            description: e,
            placement: "topRight",
        });
    };
    const errorPop = (e, message = "") => {
        notificationApi.open({
            message: message || "Some Error Occured",
            type: "error",
            description: e,
            placement: "topRight",
        });
    };
    const successPop = (e, message = "") => {
        notificationApi.open({
            message: message || "Congratulations",
            type: "success",
            description: e,
            placement: "topRight",
        });
    };
    const items = [
        {
            key: "1",
            label: "Add Event",
            children: <EventRegistration errorPop={errorPop} successPop={successPop} infoPop={infoPop} />,
        },
        {
            key: "2",
            label: "Edit Event",
            children: <EventEditing errorPop={errorPop} successPop={successPop} infoPop={infoPop} />,
        },
        {
            key: "3",
            label: "Add member",
            children: <MemberAddition errorPop={errorPop} successPop={successPop} infoPop={infoPop} />,
        },
        {
            key: "4",
            label: "Edit member",
            children: <MemberEditing errorPop={errorPop} successPop={successPop} infoPop={infoPop} />,
        },
        {
            key: "5",
            label: "Registration Stats",
            children: <RegistrationStats errorPop={errorPop} successPop={successPop} infoPop={infoPop} />,
        },
    ];

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: colorPrimary,
                },
            }}
        >
            {contextHolder}
            <div className="app-wrapper" style={{ border: `2px solid ${colorPrimary}` }}>
                <div
                    className="header"
                    style={{
                        display: "flex",
                        // alignItems: "center",
                        justifyContent: "space-between",
                        padding: "2rem",
                    }}
                >
                    <div style={{ fontSize: "2.5rem", fontWeight: "600", color: "#fff" }}>Admin Dashboard</div>
                    <div
                        className="avatar"
                        style={{
                            width: "60",
                        }}
                    >
                        <AvatarMenu admin={admin} handleLogout={handleLogout} />
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                    onChange={(e) => setOpSelect(e)}
                    size="large"
                    tabPosition={"top"}
                    style={{ padding: "1rem" }}
                />
            </div>
        </ConfigProvider>
    );
};
export default Dashboard;
