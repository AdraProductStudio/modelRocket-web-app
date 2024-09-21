import { createContext, useRef, useState } from "react";

const CommonContext =  createContext();

export const DataProvider = ({children}) => {
    const timerRef = useRef(null);
    const [productViewType, setProductViewType] = useState({});

    return(
        <CommonContext.Provider 
            value={{
                productViewType,
                setProductViewType,
                timerRef
            }}
            >
            {children}
        </CommonContext.Provider>
    )
}



export default CommonContext