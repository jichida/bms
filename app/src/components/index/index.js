/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
import Avatar from "../../img/2.png"; 
import Loginbg from "../../img/1.png";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
        };
    }
    componentWillMount() {
        
    }
    componentWillUnmount() {
    }

    render() {
        const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        const pushurl = (name)=>{
            this.props.history.push(name);
        }
        return (
            <div className="indexPage AppPage"
                style={{
                    background:`url(${Loginbg})`,
                    backgroundSize: "100% 100%",
                    minHeight : `${window.innerHeight}px`
                }}>
                >
                <div className="head">
                    <div className="title">＊＊＊＊监控系统</div>
                    <img src={Avatar} className="avatar" />
                    <span>您好：王小庆</span>
                </div>
                <div className="content">
                    <div className="li l1">
                        <div onClick={pushurl.bind(this, "./overview")}>
                            <img src="data:image/png;base64,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" />
                            <span>总览</span>
                        </div>
                    </div>
                    <div className="li l2">
                        <div onClick={pushurl.bind(this, "./carlist")}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEOUlEQVR4Xu1ZTVITQRT+3hTokklOAFVOtsYTCCcQTmBcmlhlOIF6AsMiYUk8gXiCxBOA2wxV6AXCuJSfeVY3TGg6M8lk0umg6VlBVff7+fq97/2EsOIfrbj/cAC4CFhxBFwKrHgAOBJ0KTApBfzO2a4H/mosTZi7w0bljTF5BgRlRoB/eL5J8fUJEXwDekYiYuY3UaPSNSlzHlmZAJTagxMiqjLwmxiteZSIu0xoErDBjIjBO1GjcjqvTBP3UwEot89aIH4vFJh6Mb89qHpEJxIM5lO+XN+J9rciE07MI4OkYR69GglhGfJN+T/TwbDx7PZvA5/fHtQ8oiMpGjgmwigKYqYfUf3ZsQE1M4mgUifsE/BSv8XgHxf1SnUmaTkOq9GlHx/WA+tVifxO2PSAzym2t0BYSIhyjKZOrsz4dtEIdnNgaPTICPFJL2NUoyZs2XwgAVDrvWB94D43AfYJ9LwICAx8z3OPmbvLKo2k1nvhPP9Z29TZudwZdAF6nceZ5EwM7Ef1YO7yOYvOImep1A4FG8sqIF7soh5s64L8w3DbY/TyK+Avw3qlJs6XOqHoJI02U5PsIOB0WA/289r6oArIJsVbexG93fqpCii3B0cgkg5N+9TqsSxemaV3GSuDAgQo9RngTQJtTnP8LoJGKaTPEXn5II+e9DP3XDVLt5nZBxQxJGZ+IVpcfY6wwQf+53Ofnl71E8LOW12MAaCGXTJHyKiwWN9FV0tEorHbkA+YY/qcCQDhDBN1QfywQWLykzZWzXtm/OLLtarNnl9ttwUG0/ggNwDqS4pww9ObVx7xA26IY448olHpS1KiSDrNc0ct25IPiJpjtt7gNHoXfMsNQAzaS1651Al7BIyVS9VoG3mfBZLOB5lgMh3kB0BZZJQ7IU96IZt5nwmCzgcpB0VlmgiAqOkifOTdmKNkiZE1Qd6RnvW8nwDCaPxOPcP4NAWA9M5QCJN1nrnKxLvqrKDP+fPksom7+uQpolN0i7GHfvQ26BcGQIIgwgzUM703NOF4lgy9PygMgCSaJ1c9sTdcpMELka30B4UB0OcDWfM91ERY6UaLYYoYx6MGZQFe3fLV+q4+x9xFao2IWqr+pD+QO0F4lD6tKcSn2qw3G5IjlTKZ5p/x3xg0JTGtbaU5nxwrt8OPIHxI/k/mhUI7uFI7vNDzfto+T8wHHl+fL+Dxpcjp+sdH+jtCnN2ktD7gX4sAWbJFHzC7+0AaALe7BOxlckCMr4usFpLdvfW9VA7onL0m5tbYItYkAEWAXPYdoxGwbGeK6HcAuBQwSIJFQnDZd1wKuBRwKWCuEVp2PhfR7zjADgfwl1is0i19HnMt7w+5diKA8WnYCD5a8h/62DtJrwPASgq4CHAp4DjAkeD/VgVslTQbegrtBG0YZkuHA8AW0o9Vj4uAx/oytuxyEWAL6ceqZ+Uj4C8OXK6++eUQSgAAAABJRU5ErkJggg==" />
                            <span>我的设备</span>
                        </div>
                    </div>
                    <div className="li l3">
                        <div onClick={pushurl.bind(this, "./collection")}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFTklEQVR4Xu1bXXLaVhT+zpXTAn6IdxB7BaYPncEzDZAVxDswWYHpCkxWUGUFgRWUrCDgdMbM9MFkBTUriP1goG2k0zlXuoygYAkhS2KAJxv9nu9+5++7B8KOf2jH7ccegD0DQhAY1854m0Eq9W+eZHmoCwgADH4gxnCbgGBCmUAvEwEAzP3S9aC+TQCMq5UeiGp7AJJwgT0D9i6wjwHPEgQn9cqxBNZib3CXdIDdiiD4WK20xfDD60Fj5wD4p/5z+Tsf3IrhB/T9px96fyZaZ+SeAeNa5TNAfm3BvVJ/8CZJFuQagMkvlTpb9FnSqzaaqEYOvyn+MeglBUKuAXisnd0SUBbqi8HiCgwMD/s3+v8kPrkFYPK60mBFH5m5Y4KfBEMiuiCX3xW/DHRg3PSTSwC4Xj6acOEWoGMiPjHpT9IhM/0F8F2pPzjZ1Hi5PpcAPFYrLSK6Yub3h9eDVtDQp47FASR3AMjqj7koq0wlmh5Tb3gfNMw7XrgDiEs0OVk8vi4IuQBAjJo6xVMQ15lQl7S3bPWNcYYFAPeI0QNTr2BNvsYBI3UAxI9dh08VUdkzFsfi6wsrNyr1bxa/mztlXDuTsvjV/HUszBgS81BAgcWjsPI5FQC8as76jUFlAo7mKO2rSAz0FOPOspxh1GpP7us4VtklHBMg7NHqzvz9cU/g4QE5vy67byoAyAuZFCZ/C73BNFQWD8NWaF2f9hhGZRCXJZD6z5ul0sX7pQaAH7x6BDplcPuwP3i3rnHrnP9Yq3wkUIPBX0s0ra+KD6kBoFfCi+DPDkJU4zOpA+ZAWJLn11nlZeeOq2c2CJdhK2+uTZUB5qFepVeUtvZVkmXtrHwGPyyrIZYDlpEqLBH8X7bEHV4mAULQ+Bfk1KNmkkwYYFYiKRDiGp9JDFikYVDxCducWBUfzLZcHMUoUwbMApHsK24gqUc1IlcxYCEgfttZAIzs9VTzE5YaTXMURy6Lyp5Iu8NxVvHx9dk5Kfy+uwD44sdTqzepVi6EBcXrQWcZGzZhUeYMMJXbIgBaI3ALly5R03SQDNwrZrugph+Ctf2WAzBfiS0a7g1dkBZAmbghhdMyIHQqjJFJMmeAkb5F/HQZV9LBaWPBD2DYJTW1zWrrPsItNEFomr5fOktFeK/F0m0EwButEdFiJpSM4MIuWpP2qhbWAEGkwdKqkLnHusVUpgzwm6JvfmAbkcutdfV+vwwW5VgDsVUASPByLdhKVnzDjQ4BwlVoKgfNdbbOMmVAWIGTxvE9APspsYwEkTToHeUZW+ECohmIMVFVniiGZ6oJRn1B6QGY0AhOiBCjvaoniHrf4Hm5Y4CuDdwfL0DUnG2ZBSZEvJfnOzDbRfV3J85+YC4B0Ds6jCuAzmfND3PnhXJsQ32tIbpWU4YkTPUHcFdK4bg7TJkzwO/kLgGcr+oBFqm9rCcA0CWHP6xTBGUmivod31smtAzNZSMjTkVoKkDZcjPuQYxWQU0/RXGPVBmgJz5dXAR7fDA+kcv2uiu3yArNJEXSKb417iHaARQ6T7lHKgD4Nf9FsNWVHp8U23F9d1XE13NELjWNduC7VVs56CwD+VkB+H8ag+74Cta0G4WecdKaucabOimcs6JZp+hPlMyl0cQBKKrpuUhZfv72pjyY+8xkH3656W5iVNxrtfBK3JRBy0CcaIu0NnEL3cR+MRIUNnxFp6sUWknTPC4QOtW6kAm0QBqF/CbwKExHiCaLe282YuZ2UMqK+8LPdd0yRWlzAKoVmdhqbypsPJfRK4OmTKQSGmE/9gplQNovnvbz9gCkjXjenrfzDPgP2TxPjGk11XMAAAAASUVORK5CYII=" />
                            <span>我的收藏</span>
                        </div>
                    </div>
                    <div className="li l4">
                        <div onClick={pushurl.bind(this, "./playback")}>
                            <img src="data:image/png;base64,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" />
                            <span>轨迹回放</span>
                        </div>
                    </div>
                    <div className="li l5">
                        <div onClick={pushurl.bind(this, "./warning")}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEG0lEQVR4Xu1aS1LbQBDtBiSzAEJ2qQp2YJGyvcKcIHCChBMAJwBOEHOCwAkwJ4g5AXACxMpONhibRZYukwWRZHVqhEUJWZ8ZeWxBebRzuac/b7rf9HwQpvzDKY8fFAAqAzJC4HYZls0lfZ+Z13vmyVoXulm4kkkJsOD/LenXALA6CLqV65kbWYCQCQCNlblNnJm58M84Oc5W+d6+nHQWKAAmjTizpzJAlcAb5oAnBtd2gJxWqdM/T1NCMktgVH+ESHBg7BYAl1ngSFQrdqw9URBkAfD7o1ZxZuFiFH+EAGgU9CoCfPcHnAYEGQAEg/d8ItNcK/+BFu+kCAHQLGgHAPgjqFwUBJZJj0u6gQCfmC4CuJvvmRXeRigqeKYr1zPf8+pxs5gXKU+umdcMQFyXBMIB0zPfM495nY4LngCOym2zKhKTMAAuDyxqlzJAEHGUycYGT3RW7li7ojqFAWAG4kAAoMNS2zoWdYRHvlnQrgGwEpSllMGnKgHPeCQIBOeljvmNJyBRmWZBJ5nBjwRAVCYQ0V65Y9VEg+ORb+S1S0T88sz4I8y8pyNVCfiddTNhQasSQgUR6knpz+qYZmEdAL2tsKuOqG/kHvpXcWTorh6LGisvNrYmA+iRAeCauQ+wipq2D4isNF4EPjSeoI5I9WLbOuPRParMWAHwTn0IiPUPbvfI/5FBDh2O+4xgbAA02Kzr2s8w1uYHwW1UqsW2eSQyRkR2LADErdcizj0TVco9B48t6QAEN0w8TnDJOHRSurfczlHmFwoAC8JemBtqd/2GP9/bV2GORDUrMpxG6m8XO/16mC6WdYj0LsqObdt3YZukIQCealdnB5bxbA1klNrWht9gI6/tIuKpjGDDdVA317PWgkvlr7x2SogJbTB1yaHtIKkOAdBc0Y5hBt3z+qTP3/SEHHUnDU/1f3DD88Q3yI7YEz8iuip3rE2/oDQAxj/7ntvULbWt994v6QAMli8DACPryTVOdJN7sDa9dGzm9TogfE2cBgkCwTuERl6rIeJOkuowDokkwceFuaFdl9/A/F/b8Ndi2EYlyaHU/4esCOyUKVafbbe4SDCNUwPivE0zNs2YsFpOo4eNkdIHhJ3xpXWIZ9zUAwDwkgh5QIuSeZMZwIIptU0pvktRMukSUACoDFAloDhAkaBaBdQyKGUJl6JE9QEhb35GaU95xioSVCSoSFAKf0lRokhw2kmQh7Vfq4yUEnitwfH4lQoA73UmCl9587gkLkPg3hid8b40i70YSTI/CJ69zow9Nk/SI/9/MnI9a0sUBOEMmNwNkDhEad4nCQMQ9VpU3F35IybyUHLSlyAiMIm+E059MeJeQyFW/U/WRByVLkt0g+BUo94OxNkTLgHpzmesUAGQ8QRkbl5lQOZTkLED/wHs5jtfXh4qmwAAAABJRU5ErkJggg==" />
                            <span>预警信息</span>
                        </div>
                    </div>
                    <div className="li l6">
                        <div onClick={pushurl.bind(this, "./system")}>
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEbklEQVR4Xu2bQVbbMBBAZ5T3yrIhOUDtXKDcoHCChhM0nKB0R7JpuknYlZ4AegLCCQgnAC4QuwdIanaF9+Lpk2mo7MiykRTbgbAkkTTzZySNZiYIr/wPX7n+sAGw8YBXTiBzC9Sdo13G2Id15BSGcBH4gxuV7KkA6k5vhyGdI6Kzjso/yUw0nhMdBP6xL9NDCoBbvcbY5VorLghPBEFIsCfzhiUAdadfZ/jgIUL9pQCI9CAaT73hXlKnJQCNVq+PAF/FLxLBLwSSulBVIRHCDgK+jckX0v7UH47E/y0DcHvXiLAj7KGrOW21A78fVFVZmVx158hhDG9ECET0c+YNO0oAzVaPYtYH+jKbDE9sKM+3V5EgG273DBE/icacesPdZwGYh+Fe4B+PTQD8O1cuuWepDiSTNWRjl7Yz0VUpAJYFgYupN2jbVjg5XyUApN0q8/DN9qq3QyUAyG6VyFIhHEz9wdkqvaB0AKqYQnYi24ZROoBU60dxCQQzb7BtW2lxvlIB5IkobdwwKoClApBGlEB3scAE4MdsMjhclReUBkBqfaIrAvDFwISI/Jk3dF8cAJn1ubvXgDnA4FRUeB6GbtpT1RRMKR6QZn0egfHPauzh96pC7UoEQmnWX4TTDbd7g4jvVfG5qeUX4616AH9dAeA7lXA1AIcQT2K5hET83Wh1DxHwe3wbxKPCPGupIW3d8ijTKgDVna4SJnnV8VRbjcF1bIwQFTadbhsYnpt4wWLN8gFIXl9csYbb8xHhyZvEqLDhdj3TPGRlAKQFOo1W7wQBPi+svIgKm06vk7wldDyhdABRCo2gn/bYkbk5F5ohnppanwNbCQAdS6jD1G6QSFfxICmWgifDbJTVM8A2gKbbGwHCx7R5uRfNvIFRTaLaALL2u4V8QaUByKJC4VA0tn502yRT/GXlBNPcvOl2x4C4XHe0YP21ACCLCm3s/ZWEwrYPQT4fD3lrjHlpUaHpmpXfAlxBcRsQ0e3MG/6vShkSsAIAJPU0Q7liw6PnM7uPylVhuHVmM1WejDhB5xAEoNF0Mty3qXRRcy29K/QAcHFpBCGM5gBrUSFmgDuI1AbEWB1Q0wOKslcB6+h7QAHCFbFEHgCNVvyRUoRcNtcgoDsAjEpu4pM7WiMXgGRN3aZ0BcxFQq0h2R8ge11KeoTWu0FKBNBsdc8B8KkML6tIS7vEsp6qBRjSaAkCOEOguqh8Wm4hpU2Od4rdj2PpayORyh2sqkQrO0V5KAkEHTGBWa4qz1udh9aPqbl4Z5g4S2ar7OOjpV8H+KMdozPETqxZKYce3GXDkJRtrqpp8vY15QKQQ17lV3RqCqsunS8E3gAwtW6e8dJ3v2KgzaRIlnyFeMDjOcI7N1msS1MuHAW2n8UqCIUByLJEWZ8bA+DFTgCKNyUXpg3eZf0gIksUIwC2anlZQqo+J4Bvs8mgrzuHNgBVXl9XGN1x08lAWw/tgVX6VckGQBkeoOuuVRunvQWqpoiuPBsAuuReyrhX7wF/AYettm6ei2ZXAAAAAElFTkSuQmCC" />
                            <span>系统设置</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Page);
