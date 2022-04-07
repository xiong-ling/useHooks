// 轮询接口

import { useCallback, useRef } from "react";
import useUnMount from './useUnMount'
import { sleep } from '../utils'

const usePolling = (polling: () => Promise<any>): [doPolling: () => void, cancelPolling: () => void] => {
    const isPollingRef = useRef(false)
    const cancelRef = useRef(false)

    const doPolling = useCallback(() => {
        // 是否正在轮询，是，返回，不能多个接口同时轮询，避免这些接口有先后顺序相互影响
        if (isPollingRef.current) {
            console.log(`[doPolling] isPolling, return immediately`);
            return;
        }
        isPollingRef.current = true;

        const pollNext = async () => {
            // 如果掉了取消轮询，那么就返回不执行
            if (cancelRef.current) {
                isPollingRef.current = false;
                cancelRef.current = false;
                return;
            }
            // 发送请求，返回值组装一下，给个 hasFinshed 判断是否还要继续轮询
            const { hasFinshed } = await polling();
            
            if (!hasFinshed) {
                await sleep(30000);
                pollNext()
            } else {
                isPollingRef.current = false;
            }
        };

        pollNext()
    }, [])

    const cancelPolling = useCallback(() => {
        if (isPollingRef.current) {
            cancelRef.current = true;
        }
    }, [])

    useUnMount(cancelPolling);

    return [doPolling, cancelPolling]
};

export default usePolling;
