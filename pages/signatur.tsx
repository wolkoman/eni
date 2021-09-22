import React, {useState} from 'react';
import Site from '../components/Site';

function Signatur({signatur}: {signatur:{ address: string; mail: string; name: string; tel: string; position: string; parishes: { neustift: boolean; emmaus: boolean; inzersdorf: boolean } } }) {
  return <div style={{fontFamily: "Arial"}}>
    <div>
      <div style={{fontSize: 13, fontWeight: 'bold'}}>{signatur.name}</div>
      <div style={{fontSize: 12, fontStyle: 'italic'}}>{signatur.position}</div>
      {Object.values(signatur.parishes).some(x => x) && <div style={{fontSize: 12, fontStyle: ''}}>
        Pfarre{' '}
        {[
          signatur.parishes.emmaus ? 'Emmaus am Wienerberg' : null,
          signatur.parishes.inzersdorf ? 'Inzersdorf St. Nikolaus' : null,
          signatur.parishes.neustift ? 'Inzersdorf Neustift' : null,
        ].filter(x => !!x).join(', ')}

      </div>}
    </div>
    <br/>

    <div style={{fontSize: 12}}>

      {[
        signatur.mail ? <><a style={{color: '#2A6266'}}
                             href={`mailto:${signatur.mail}`}>{signatur.mail}</a> | </> : null,
        signatur.tel ? <><a style={{color: '#2A6266'}} href={`tel:${signatur.tel}`}>{signatur.tel}</a> | </> : null,
        <a style={{color: '#2A6266'}} href="https://eni.wien">www.eni.wien</a>
      ].filter(x => !!x)}
      {signatur.address && <div>{signatur.address}</div>}
      <div>
        <img
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/7QAsUGhvdG9zaG9wIDMuMAA4QklNA+0AAAAAABAASAAAAAEAAQBIAAAAAQAB/+EhbGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcEdJbWc9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9nL2ltZy8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICAgICAgICAgIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIElsbHVzdHJhdG9yIENDIDIzLjAgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIxLTA5LTE1VDA5OjU0OjM1KzAyOjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpUaHVtYm5haWxzPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDx4bXBHSW1nOndpZHRoPjI1NjwveG1wR0ltZzp3aWR0aD4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6aGVpZ2h0PjI0PC94bXBHSW1nOmhlaWdodD4KICAgICAgICAgICAgICAgICAgPHhtcEdJbWc6Zm9ybWF0PkpQRUc8L3htcEdJbWc6Zm9ybWF0PgogICAgICAgICAgICAgICAgICA8eG1wR0ltZzppbWFnZT4vOWovNEFBUVNrWkpSZ0FCQWdFQVNBQklBQUQvN1FBc1VHaHZkRzl6YUc5d0lETXVNQUE0UWtsTkErMEFBQUFBQUJBQVNBQUFBQUVBJiN4QTtBUUJJQUFBQUFRQUIvKzRBRGtGa2IySmxBR1RBQUFBQUFmL2JBSVFBQmdRRUJBVUVCZ1VGQmdrR0JRWUpDd2dHQmdnTERBb0tDd29LJiN4QTtEQkFNREF3TURBd1FEQTRQRUE4T0RCTVRGQlFURXh3Ykd4c2NIeDhmSHg4Zkh4OGZId0VIQndjTkRBMFlFQkFZR2hVUkZSb2ZIeDhmJiN4QTtIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGYvOEFBRVFnQUdBRUFBd0VSJiN4QTtBQUlSQVFNUkFmL0VBYUlBQUFBSEFRRUJBUUVBQUFBQUFBQUFBQVFGQXdJR0FRQUhDQWtLQ3dFQUFnSURBUUVCQVFFQUFBQUFBQUFBJiN4QTtBUUFDQXdRRkJnY0lDUW9MRUFBQ0FRTURBZ1FDQmdjREJBSUdBbk1CQWdNUkJBQUZJUkl4UVZFR0UyRWljWUVVTXBHaEJ4V3hRaVBCJiN4QTtVdEhoTXhaaThDUnlndkVsUXpSVGtxS3lZM1BDTlVRbms2T3pOaGRVWkhURDB1SUlKb01KQ2hnWmhKUkZScVMwVnROVktCcnk0L1BFJiN4QTsxT1QwWlhXRmxhVzF4ZFhsOVdaMmhwYW10c2JXNXZZM1IxZG5kNGVYcDdmSDErZjNPRWhZYUhpSW1LaTR5TmpvK0NrNVNWbHBlWW1aJiN4QTtxYm5KMmVuNUtqcEtXbXA2aXBxcXVzcmE2dm9SQUFJQ0FRSURCUVVFQlFZRUNBTURiUUVBQWhFREJDRVNNVUVGVVJOaElnWnhnWkV5JiN4QTtvYkh3Rk1IUjRTTkNGVkppY3ZFekpEUkRnaGFTVXlXaVk3TENCM1BTTmVKRWd4ZFVrd2dKQ2hnWkpqWkZHaWRrZEZVMzhxT3p3eWdwJiN4QTswK1B6aEpTa3RNVFU1UFJsZFlXVnBiWEYxZVgxUmxabWRvYVdwcmJHMXViMlIxZG5kNGVYcDdmSDErZjNPRWhZYUhpSW1LaTR5TmpvJiN4QTsrRGxKV1dsNWlabXB1Y25aNmZrcU9rcGFhbnFLbXFxNnl0cnErdi9hQUF3REFRQUNFUU1SQUQ4QTlVNHE3RlhZcTdGWFlxN0ZYWXE3JiN4QTtGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXE3RlhZcTdGWFlxN0ZYWXFodFIxTFQ5TnM1THpVTG1PMHRZaFdTZVpnaUQ2VDNQYkNCYUpTJiN4QTtBRmxnT3JmbWZCcldsMzFuNVgwZlZOWE54RExCRnFGdmJ0SGJLN3FVRENWeXAySnIweVloWE54cForSUVSQkxFb2RBMFQ4dmRWOGhhJiN4QTszZTJyNllaSUx0Zk1WeUROTW9tYTJWWXc0VXlLdjd5UTdLUDFaT3pLdzBpQXhtSk8zZTlnazgwK1hJOUtoMWFUVWJkZE91QlczdVM0JiN4QTtDeWV5ZDJQc044cUVTVFRsWk5SamhIaWxJQU1LMXZ6UFkrYk5lMFhTZkwrcTNzZHUwczM2Um5zUFd0eUZFZFUrTmxBTzQ4Q011akF4JiN4QTtCSkRwOCtyanFja0lZcHlxenhHTmpvdjhtZm1CcEdtNlNtbCtaTlJtaTFhQ1daWkRlck16bGZVYmp5a0trYkxUcWNjbUlrMkJzblE5JiN4QTtvd3h3NE1zaUpnbjZyNys5bUY3NWl0VnNyZTQwN2pxRFhyY0xQMFdWa1p2ZHdhVUdhanRIV25UZ0FSTXNrelVSNStiMGVqeHh6ZW9TJiN4QTtIQU55VlBUZFYxSmI5ZE8xYUZFdVpWTWx2TkRVeHVvRldYZm9WL3o5OFhSNjdNTXZnNmlJRTVDNG1QSTk0OTQvSG5rWnNFRERqeG4wJiN4QTtqbUR6VHJOeTRLU1A1NThrbzdJL21EVFZkU1F5bThnQkJHeEJCZkpjSjdtdnhZZDQrYTMvQUI1NUcvNm1MVFAra3kzL0FPYThlRTl5JiN4QTsrTkR2SHpkL2p6eU4vd0JURnBuL0FFbVcvd0R6WGp3bnVYeG9kNCtidjhlZVJ2OEFxWXRNL3dDa3kzLzVyeDRUM0w0ME84Zk4zK1BQJiN4QTtJMy9VeGFaLzBtVy8vTmVQQ2U1ZkdoM2o1dS94NTVHLzZtTFRQK2t5My81cng0VDNMNDBPOGZOMytQUEkzL1V4YVovMG1XLy9BRFhqJiN4QTt3bnVYeG9kNCtidjhlZVJ2K3BpMHovcE10LzhBbXZIaFBjdmpRN3g4M2Y0ODhqZjlURnBuL1NaYi93RE5lUENlNWZHaDNqNXUvd0FlJiN4QTtlUnYrcGkwei9wTXQvd0RtdkhoUGN2alE3eDgzZjQ4OGpmOEFVeGFaL3dCSmx2OEE4MTQ4SjdsOGFIZVBtNy9IbmtiL0FLbUxUUDhBJiN4QTtwTXQvK2E4ZUU5eStORHZIemQvanp5Ti8xTVdtZjlKbHYvelhqd251WHhvZDQrYnY4ZWVSditwaTB6L3BNdC8rYThlRTl5K05Edkh6JiN4QTtkL2p6eU4vMU1XbWY5Smx2L3dBMTQ4SjdsOGFIZVBtNy9IbmtiL3FZdE0vNlRMZi9BSnJ4NFQzTDQwTzhmTjMrUFBJMy9VeGFaLzBtJiN4QTtXLzhBelhqd251WHhvZDQrYnY4QUhua2IvcVl0TS82VExmOEE1cng0VDNMNDBPOGZOMytQUEkzL0FGTVdtZjhBU1piL0FQTmVQQ2U1JiN4QTtmR2gzajV1L3g1NUcvd0NwaTB6L0FLVExmL212SGhQY3ZqUTd4ODNmNDg4amY5VEZwbi9TWmIvODE0OEo3bDhhSGVQbTcvSG5rYi9xJiN4QTtZdE0vNlRMZi9tdkhoUGN2alE3eDgzZjQ4OGpmOVRGcG4vU1piLzhBTmVQQ2U1ZkdoM2o1c04vTXJYL0t1dWY0VjArejFLeDFQMVBNJiN4QTtWaDlZdElaNGJqbENmVVIrYUt6ZkI4UUJxS2I1S0FJdjNOR2VjWmNJQkI5UWVuSWlJaW9paFVVQUtvRkFBTmdBQmxibHRTd3hUUk5GJiN4QTtNaXlST0tQRzRES1FleEIyT0swd1A4MmRDMGxQSk1sM0RiSkJOcExSdHAvcEQwMWo5YWVOWG9pMFdocjRaZmdrZUt1OTAvYldHSndHJiN4QTtWYndxdmlRejFFUkZDb29WUnNGQW9CbER0d0tRK3BhZmJhall6MlZ5cGFDNFJvM29hTUF3cFZUMk8vWENEUnRobHhpY1RFOGl4NDZGJiN4QTtwdWhuUXRPMDZNeFcwZDB6QUZpekZtV3BZazl6bW03VmtUbndFL3ovQU5EbDltNmVHSERPRUJ0dy9wVERXYlhVL3dCS1dOOVl3TGNmJiN4QTtWMWxWNDJjSjlzQURjNE8wTU9meDhlWEZFVDRCTGE2NXQrbW5qOE9VSm1ycnBiYTZqNW1ETHowbENsUnk0em9UUW5lbGFZalY2Mjk4JiN4QTtJcit1Rk9IQjBuL3NXTGViUHllMFBWcm42NXAwTnZaVHNBSGhXQ0JJanVTWDJpWnVScm0yejVjd2grNkVUTCtsZGZZNldmWjJQSk81JiN4QTtTbkVWL0RYNldQZjhxSGwvMzlhZjhpNC8rcUdZWDVqdEQrYmcrYy8xSi9ralRmNnBtLzJMditWRHkvNyt0UDhBa1hIL0FOVU1mekhhJiN4QTtIODNCODUvcVgrU05OL3FtYi9ZdS93Q1ZEeS83K3RQK1JjZi9BRlF4L01kb2Z6Y0h6bitwZjVJMDMrcVp2OWk3L2xROHYrL3JUL2tYJiN4QTtILzFReC9NZG9memNIem4rcGY1STAzK3FadjhBWXUvNVVQTC9BTCt0UCtSY2YvVkRIOHgyaC9Od2ZPZjZsL2tqVGY2cG0vMkx2K1ZEJiN4QTt5LzcrdFA4QWtYSC9BTlVNZnpIYUg4M0I4NS9xWCtTTk4vcW1iL1l1L3dDVkR5LzcrdFArUmNmL0FGUXgvTWRvZnpjSHpuK3BmNUkwJiN4QTszK3FadjlpNy9sUTh2Ky9yVC9rWEgvMVF4L01kb2Z6Y0h6bitwZjVJMDMrcVp2OEFZdS81VVBML0FMK3RQK1JjZi9WREg4eDJoL053JiN4QTtmT2Y2bC9ralRmNnBtLzJMditWRHkvNyt0UDhBa1hIL0FOVU1mekhhSDgzQjg1L3FYK1NOTi9xbWIvWXUvd0NWRHkvNyt0UCtSY2YvJiN4QTtBRlF4L01kb2Z6Y0h6bitwZjVJMDMrcVp2OWk3L2xROHYrL3JUL2tYSC8xUXgvTWRvZnpjSHpuK3BmNUkwMytxWnY4QVl1LzVVUEwvJiN4QTtBTCt0UCtSY2YvVkRIOHgyaC9Od2ZPZjZsL2tqVGY2cG0vMkx2K1ZEeS83K3RQOEFrWEgvQU5VTWZ6SGFIODNCODUvcVgrU05OL3FtJiN4QTtiL1l1L3dDVkR5LzcrdFArUmNmL0FGUXgvTWRvZnpjSHpuK3BmNUkwMytxWnY5aTcvbFE4disvclQva1hILzFReC9NZG9memNIem4rJiN4QTtwZjVJMDMrcVp2OEFZdS81VVBML0FMK3RQK1JjZi9WREg4eDJoL053Zk9mNmwva2pUZjZwbS8yTHYrVkR5LzcrdFA4QWtYSC9BTlVNJiN4QTtmekhhSDgzQjg1L3FYK1NOTi9xbWIvWXUvd0NWRHkvNyt0UCtSY2YvQUZReC9NZG9memNIem4rcGY1STAzK3FadjlpNy9sUTh2Ky9yJiN4QTtUL2tYSC8xUXgvTWRvZnpjSHpuK3BmNUkwMytxWnY4QVl1LzVVUEwvQUwrdFArUmNmL1ZESDh4MmgvTndmT2Y2bC9ralRmNnBtLzJMJiN4QTt2K1ZEeS83K3RQOEFrWEgvQU5VTWZ6SGFIODNCODUvcVgrU05OL3FtYi9ZcWx2OEFrZmVXMDhkeGIzVnZEY1FzSklwbzFSWFIxTlZaJiN4QTtXRUlJSVBRakh4KzBQNXVENXovVW83SjB3L3ltYi9ZcHovZ1B6Ny8xTkZ4LzBrU2Y5VThIaTYvK2JnLzJmNm16K1RzUCtxNS85aTcvJiN4QTtBQUg1OS82bWk0LzZTSlArcWVQaTYvOEFtNFA5bitwZjVPdy82cm4vQU5pb1h2NWFlY0wrMmUxdnZNRXR6YXlVOVNDU2VSa2Jpd1lWJiN4QTtCajhSWEh4dTBCeWpnLzJmNm1FK3l0UE1WTEpuTWU3MHN6LzUzVC90Vy84QUpmTWIvWEwvQUdqL0FHYnVQOEYvMnovWXUvNTNUL3RXJiN4QTsvd0RKZkgvWEwvYVA5bXYrQy83Wi9zVkk2ZDVqdXIreW12MnMxaHRKREpTRDFlUjJwKzJLWldkSnJNdVhITEtjWERDVituaXY3V1hqJiN4QTtZSVFrSWNkeUZiMG4rYjUxN3NWZi85az08L3htcEdJbWc6aW1hZ2U+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpBbHQ+CiAgICAgICAgIDwveG1wOlRodW1ibmFpbHM+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMjEtMDktMTVUMDk6NTQ6MzUrMDI6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIxLTA5LTE1VDA3OjU0OjM2WjwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2UvanBlZzwvZGM6Zm9ybWF0PgogICAgICAgICA8eG1wTU06RGVyaXZlZEZyb20gcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiLz4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDo3NzM1MjcxMy00MDMxLTAzNDUtOTk3Zi02NDVmYTViNzJjYTY8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpJbnN0YW5jZUlEPnhtcC5paWQ6NzczNTI3MTMtNDAzMS0wMzQ1LTk5N2YtNjQ1ZmE1YjcyY2E2PC94bXBNTTpJbnN0YW5jZUlEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6NzczNTI3MTMtNDAzMS0wMzQ1LTk5N2YtNjQ1ZmE1YjcyY2E2PC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo3NzM1MjcxMy00MDMxLTAzNDUtOTk3Zi02NDVmYTViNzJjYTY8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjEtMDktMTVUMDk6NTQ6MzUrMDI6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIElsbHVzdHJhdG9yIENDIDIzLjAgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAKBwcHCAcKCAgKDwoICg8SDQoKDRIUEBASEBAUFA8RERERDxQUFxgaGBcUHx8hIR8fLSwsLC0yMjIyMjIyMjIyAQsKCgsMCw4MDA4SDg4OEhQODg4OFBkRERIRERkgFxQUFBQXIBweGhoaHhwjIyAgIyMrKykrKzIyMjIyMjIyMjL/wAARCAAqAfEDASIAAhEBAxEB/8QAqAABAQEBAQEBAQAAAAAAAAAAAAYFBAIDBwEBAQADAQEAAAAAAAAAAAAAAAACAwQBBRAAAQMBBgQCBQcLBQAAAAAAAAECAwQRkpMFBhYS0lNVITFBUSIVB2FxMqITFFSBkdFCgkNzs9M0NaFSssIzEQABAgQDBQYCBwkAAAAAAAABAAIRUZEDEgQlIVKiE2UxQWFxMhSBIqHRI1MkBRWxQpKyM0NjNET/2gAMAwEAAhEDEQA/AP2YABEAARAAEQABEAARAAEQABEAARAA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"/>
      </div>
    </div>
  </div>;
}

export default function HomePage() {

  const [signatur, setSignatur] = useState({
    name: 'Maximilian Mustermann',
    position: 'Position',
    parishes: {emmaus: true, inzersdorf: true, neustift: true},
    mail: 'kanzlei@eni.wien',
    tel: '+4366012345678',
    address: 'Draschestraße 105, 1230 Wien'
  })

  return <Site title="Mail Signatur">
    <div className="text-lg font-bold">Daten</div>
    <div className="mb-12">
      <div className="opacity-80 text-sm mt-2">Name</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.name}
          onChange={(e) => setSignatur(x => ({...x, name: e.target.value}))}
      />
      <div className="opacity-80 text-sm mt-2">Funktion</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.position}
          onChange={(e) => setSignatur(x => ({...x, position: e.target.value}))}
      />
      <div className="opacity-80 text-sm mt-2">Mail Adresse</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.mail}
          onChange={(e) => setSignatur(x => ({...x, mail: e.target.value}))}
      />
      <div className="opacity-80 text-sm mt-2">Telefon</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.tel}
          onChange={(e) => setSignatur(x => ({...x, tel: e.target.value}))}
      />
      <div className="opacity-80 text-sm mt-2">Adresse</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.address}
          onChange={(e) => setSignatur(x => ({...x, address: e.target.value}))}
      />
      <div className="opacity-80 text-sm mt-2">Pfarren</div>
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.emmaus}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, emmaus: e.target.checked}}))}
      />
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.inzersdorf}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, inzersdorf: e.target.checked}}))}
      />
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.neustift}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, neustift: e.target.checked}}))}
      />
    </div>


    <div className="text-lg font-bold">Signatur</div>
    <div style={{padding: 10, border: "1px solid grey"}} contentEditable="true">
      <Signatur signatur={signatur}/>
    </div>


  </Site>
}