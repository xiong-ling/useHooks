// 组件卸载时的钩子，componentWillUnMount

import { useEffect } from "react"

const useUnMount = (fn: Function): void => {
    useEffect(() => () => { fn() }, [])
};

export default useUnMount;
