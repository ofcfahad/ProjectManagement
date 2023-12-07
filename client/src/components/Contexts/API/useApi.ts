import { useContext } from "react";
import { ApiContext } from "./APIContext";

const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};

export default useApi