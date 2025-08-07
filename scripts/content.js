window.onload = function () {
    const hljsbtn = document.createElement('button');
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL('images/code.svg');
    img.style.height = '22px';
    img.style.width = '22px';
    img.style.filter = 'brightness(0) invert(1)';

    hljsbtn.appendChild(img);

    hljsbtn.type = 'button';
    hljsbtn.style.height = '48px';
    hljsbtn.style.width = '48px';
    hljsbtn.style.borderRadius = '50%';
    hljsbtn.style.border = 'none';
    hljsbtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    hljsbtn.style.color = '#fff';
    hljsbtn.style.cursor = 'pointer';
    hljsbtn.style.position = 'fixed';
    hljsbtn.style.bottom = '80px';
    hljsbtn.style.right = '24px';
    hljsbtn.style.zIndex = '9999';
    hljsbtn.style.display = 'flex';
    hljsbtn.style.justifyContent = 'center';
    hljsbtn.style.alignItems = 'center';
    hljsbtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    hljsbtn.style.transition = 'all 0.3s ease';
    hljsbtn.style.backdropFilter = 'blur(10px)';
    hljsbtn.title = '高亮代码块';

    // 悬停效果
    hljsbtn.addEventListener('mouseenter', function() {
        hljsbtn.style.transform = 'scale(1.1) translateY(-2px)';
        hljsbtn.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)';
    });

    hljsbtn.addEventListener('mouseleave', function() {
        hljsbtn.style.transform = 'scale(1) translateY(0)';
        hljsbtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)';
    });

    hljsbtn.addEventListener('click', highlightCodeBlocks);

    document.body.appendChild(hljsbtn);
};

// 添加消息监听器
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'highlightCode') {
        highlightCodeBlocks();
        sendResponse({ status: '高亮处理完成' });
    }
    return true; // 表示会异步发送响应
});

// 将代码高亮功能抽取为单独的函数
function highlightCodeBlocks() {
    const memos = document.getElementsByClassName('richText');
    const memos_array = Array.from(memos);
    memos_array.forEach((memo) => {
        let children = memo.children;
        const memo_p_array = Array.from(children);
        let languageFlag = false;
        let codeContentArr = [];
        let languageType = '';
        for (let i = 0; i < memo_p_array.length; i++) {
            if (memo_p_array[i].innerHTML.startsWith('```') && memo_p_array[i].innerHTML.substring(3) != '') {
                languageType = 'language-' + memo_p_array[i].innerHTML.substring(3);
                languageFlag = true;
                memo.removeChild(memo_p_array[i]);
                continue;
            } else if (memo_p_array[i].innerHTML.startsWith('```') && memo_p_array[i].innerHTML.substring(3) === '') {
                // memo.removeChild(memo_p_array[i]);
                languageFlag = false;

                // 保存原始代码内容用于复制（统一缩进为4空格）
                const codeForCopy = codeContentArr.map(line => {
                    // 将制表符转换为4个空格
                    return line.replace(/\t/g, '    ');
                });

                let pre = document.createElement('pre');
                let code = document.createElement('code');
                
                // 处理代码内容，统一缩进为4空格
                const processedContent = codeContentArr.map(line => {
                    return line.replace(/\t/g, '    ');
                }).join('\n');
                
                code.innerHTML = processedContent;
                code.className = languageType;

                let wrapper = document.createElement('div');
                wrapper.style.position = 'relative';
                wrapper.style.marginBottom = '1em';
                wrapper.style.borderRadius = '8px';
                wrapper.style.overflow = 'hidden';

                // 为代码块添加语言标签
                if (languageType && languageType !== 'language-') {
                    let langLabel = document.createElement('div');
                    langLabel.textContent = languageType.replace('language-', '').toUpperCase();
                    langLabel.style.position = 'absolute';
                    langLabel.style.top = '6px';
                    langLabel.style.left = '16px';
                    langLabel.style.fontSize = '10px';
                    langLabel.style.fontWeight = '600';
                    langLabel.style.color = 'rgba(255, 255, 255, 0.6)';
                    langLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    langLabel.style.padding = '2px 6px';
                    langLabel.style.borderRadius = '3px';
                    langLabel.style.fontFamily = 'monospace';
                    langLabel.style.zIndex = '10';
                    langLabel.style.backdropFilter = 'blur(4px)';
                    langLabel.style.userSelect = 'none';
                    langLabel.style.pointerEvents = 'none';
                    wrapper.appendChild(langLabel);
                }

                // 创建复制按钮
                let copyBtn = document.createElement('button');
                copyBtn.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                copyBtn.style.position = 'absolute';
                copyBtn.style.top = '20px';
                copyBtn.style.right = '12px';
                copyBtn.style.zIndex = '20';
                copyBtn.style.width = '28px';
                copyBtn.style.height = '28px';
                copyBtn.style.padding = '0';
                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                copyBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                copyBtn.style.borderRadius = '6px';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.display = 'flex';
                copyBtn.style.justifyContent = 'center';
                copyBtn.style.alignItems = 'center';
                copyBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                copyBtn.style.transition = 'all 0.2s ease';
                copyBtn.style.backdropFilter = 'blur(8px)';
                copyBtn.title = '复制代码';

                // 悬停效果
                copyBtn.addEventListener('mouseenter', function() {
                    copyBtn.style.background = 'rgba(255, 255, 255, 0.2)';
                    copyBtn.style.color = 'rgba(255, 255, 255, 0.9)';
                    copyBtn.style.transform = 'scale(1.05)';
                });

                copyBtn.addEventListener('mouseleave', function() {
                    copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                    copyBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                    copyBtn.style.transform = 'scale(1)';
                });

                copyBtn.addEventListener('click', function (e) {
                    e.stopPropagation();

                    // 直接使用预处理的代码内容，已经转换为4空格缩进
                    let decodedContent = [];
                    for (let i = 0; i < codeForCopy.length; i++) {
                        // 创建临时元素解码HTML
                        const tempElement = document.createElement('div');
                        tempElement.innerHTML = codeForCopy[i];
                        decodedContent.push(tempElement.textContent || tempElement.innerText);
                    }

                    // 最终复制内容（4空格缩进）
                    const codeText = decodedContent.join('\n');

                    // 复制到剪贴板
                    navigator.clipboard
                        .writeText(codeText)
                        .then(() => {
                            // 成功反馈
                            copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>';
                            copyBtn.style.background = 'rgba(34, 197, 94, 0.2)';
                            copyBtn.style.color = '#22c55e';
                            copyBtn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                            copyBtn.title = '已复制!';

                            setTimeout(() => {
                                copyBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                                copyBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                                copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                copyBtn.title = '复制代码';
                            }, 2000);
                        })
                        .catch((err) => {
                            console.error('复制失败:', err);
                            // 错误反馈
                            copyBtn.style.background = 'rgba(239, 68, 68, 0.2)';
                            copyBtn.style.color = '#ef4444';
                            copyBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                            copyBtn.title = '复制失败';
                            
                            setTimeout(() => {
                                copyBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                                copyBtn.style.color = 'rgba(255, 255, 255, 0.7)';
                                copyBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                copyBtn.title = '复制代码';
                            }, 2000);
                        });
                });

                pre.appendChild(code);
                wrapper.appendChild(pre);
                wrapper.appendChild(copyBtn);

                memo_p_array[i].innerHTML = '';
                memo_p_array[i].appendChild(wrapper);
                // memo.appendChild(pre);
                //清空数组
                codeContentArr = [];
                languageType = '';
                continue;
            } else {
                if (languageFlag) {
                    // 处理内容中的a标签
                    let content = memo_p_array[i].innerHTML;

                    // 创建临时DOM元素来解析HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = content;

                    // 查找所有a标签
                    const links = tempDiv.querySelectorAll('a');
                    links.forEach((link) => {
                        // 获取href属性
                        const href = link.getAttribute('href');
                        if (href) {
                            // 替换整个a标签为@+href
                            const linkText = `${href}`;
                            // 创建文本节点
                            const textNode = document.createTextNode(linkText);
                            // 替换a标签为文本节点
                            link.parentNode.replaceChild(textNode, link);
                        }
                    });

                    // 获取处理后的内容
                    content = tempDiv.innerHTML;
                    codeContentArr.push(content);
                    memo.removeChild(memo_p_array[i]);
                }
            }
        }
    });
    hljs.highlightAll();
}
