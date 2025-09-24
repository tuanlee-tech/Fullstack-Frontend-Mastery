import { useCallback, useEffect, useRef, useState } from "react";

const BASE_URL = window._adminApi;
const cacheStore = new Map();

/**
 * 🔗 Helper: Build URL với query params
 */
function buildUrl(endpoint, params = {}) {
    const query = Object.entries(params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join("&");

    return query ? `${BASE_URL}${endpoint}?${query}` : `${BASE_URL}${endpoint}`;
}

/**
 * 🔗 Helper: Tạo cache key duy nhất (method + url + body)
 */
function makeCacheKey(method, url, body) {
    return `${method}:${url}:${body ? JSON.stringify(body) : ""}`;
}

/**
 * 🪝 useFetch Hook
 *
 * Hook fetch API **có sẵn Abort, Debounce, Cache**.
 * Giúp tránh lặp code fetch, xử lý token, hủy request, và cache local.
 *
 * ---
 * @param {Object} config - Cấu hình hook
 * @param {string} config.endpoint - API endpoint (vd: "/salon/search")
 * @param {Object} [config.params={}] - Query params object
 * @param {string} [config.method="GET"] - HTTP method
 * @param {Object} [config.body] - Request body (tự stringify nếu có)
 * @param {boolean} [config.auth=false] - Nếu true → tự thêm Authorization Bearer token
 * @param {boolean} [config.enabled=true] - Nếu false → không auto fetch (lazy fetch)
 * @param {number} [config.debounce=0] - Thời gian debounce (ms) trước khi fetch
 * @param {boolean} [config.cache=false] - Bật cache frontend (theo URL + method + body)
 * @param {Function} [config.onSuccess] - Callback khi fetch thành công (data) => void
 * @param {Function} [config.onError] - Callback khi fetch lỗi (err) => void
 *
 * ---
 * @returns {Object} - Trạng thái và hàm điều khiển
 * @property {any} data - Kết quả trả về từ API
 * @property {string|null} error - Thông tin lỗi (nếu có)
 * @property {"idle"|"loading"|"success"|"error"} status - Trạng thái request
 * @property {boolean} loading - Có đang loading hay không
 * @property {Function} refetch - Hàm gọi lại API (bỏ qua cache)
 * @property {Function} abort - Hàm hủy request hiện tại
 *
 * ---
 * @example
 * // 1. GET request with auto fetch
 * const { data, loading, error } = useFetch({
 *   endpoint: "/salon/search",
 *   params: { s: "GetSalonCalendarWalkin", salonid: "123", day: "2025-09-23" },
 *   auth: true,
 *   enabled: true,
 *   cache: true,
 *   debounce: 300,
 *   onSuccess: (res) => console.log("✅ success:", res),
 *   onError: (err) => console.error("❌ error:", err),
 * });
 *
 * // 2. POST request (lazy)
 * const { refetch } = useFetch({
 *   endpoint: "/booking/create",
 *   method: "POST",
 *   body: { salonId: "123", serviceId: "abc" },
 *   auth: true,
 *   enabled: false, // ❌ chỉ gọi khi refetch()
 * });
 *
 * // Gọi API
 * refetch();
 */
export function useFetch({
    endpoint,
    params = {},
    method = "GET",
    body,
    auth = false,
    enabled = true,
    debounce = 0,
    cache = false,
    onSuccess,
    onError,
}) {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [error, setError] = useState(null);

    const url = buildUrl(endpoint, params);
    const controllerRef = useRef(null);
    const debounceRef = useRef(null);
    const isMounted = useRef(true);

    const cacheKey = makeCacheKey(method, url, body);

    const fetchData = useCallback(
        async (override = {}) => {
            const { skipCache = false } = override;

            if (!enabled || !url) return;

            // ❌ Abort request cũ
            if (controllerRef.current) controllerRef.current.abort();

            // ✅ Cache check
            if (cache && cacheStore.has(cacheKey) && !skipCache) {
                setData(cacheStore.get(cacheKey));
                setStatus("success");
                return;
            }

            const controller = new AbortController();
            controllerRef.current = controller;
            const { signal } = controller;

            setStatus("loading");
            setError(null);

            const headers = { "Content-Type": "application/json" };
            if (auth) {
                const token = window.getCookie("token_AdminLight");
                if (!token) {
                    setError("Missing auth token");
                    setStatus("error");
                    return;
                }
                headers.Authorization = "Bearer " + token;
            }

            try {
                const response = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                    signal,
                });

                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

                const result = await response.json();
                const { data, error } = result;

                if (error) {
                    if (!signal.aborted && isMounted.current) {
                        setError(error || "Unknown error");
                        setStatus("error");
                        setData(null);
                        onError?.(error);
                    }
                } else {
                    if (!signal.aborted && isMounted.current) {
                        setData(data);
                        setStatus("success");
                        if (cache) cacheStore.set(cacheKey, data);
                        onSuccess?.(data);
                    }
                }
            } catch (err) {
                if (err.name === "AbortError") {
                    console.log("⚡ Request aborted:", url);
                    return;
                }
                if (isMounted.current) {
                    setError(err.message || "Unknown error");
                    setStatus("error");
                    setData(null);
                    onError?.(err);
                }
            }
        },
        [url, method, body, auth, enabled, cache, onSuccess, onError, cacheKey]
    );

    // ✅ Auto fetch with debounce
    useEffect(() => {
        if (!enabled) return;

        if (debounce > 0) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                fetchData();
            }, debounce);
            return () => clearTimeout(debounceRef.current);
        } else {
            fetchData();
        }
    }, [fetchData, debounce, enabled]);

    // ✅ Cleanup khi unmount
    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    return {
        data,
        error,
        status,
        loading: status === "loading",
        refetch: (opt) => fetchData({ skipCache: true, ...opt }),
        abort: () => controllerRef.current?.abort(),
    };
}
