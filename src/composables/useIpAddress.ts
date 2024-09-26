import os from 'os'

/**
 * Gets the IP address of the current host / container.
 *
 * Loops through available network interfaces to find the first IPv4 address that is not
 * the loopback address 127.0.0.1 and is not marked as an internal IP address.
 *
 * @returns The IP address string if found, '0.0.0.0' if not found.
 */
export const IpAddress = () => {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    if (iface) {
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        /**
         * Check if this interface meets our criteria:
         * - IPv4 address family
         * - Not loopback address 127.0.0.1
         * - Not marked as internal IP
         */
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) return alias.address
      }
    }
  }
  // No suitable IP address found
  return '0.0.0.0'
}
