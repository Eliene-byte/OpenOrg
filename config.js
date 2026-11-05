// OpenOrg — configuração pública (pode ir para o repositório, não é segredo).
// Crie um OAuth App do GitHub com "Device Flow" habilitado (ver README > Login com GitHub)
// e cole o Client ID aqui. Sem Client ID, o botão "Entrar" mostra o guia de configuração.
window.OPENORG = {
  owner: 'Eliene-byte',
  repo: 'OpenOrg',
  oauthClientId: '', // ex.: 'Ov23liXXXXXXX'
  // Extensões permitidas no acervo (segurança: nada de .html/.js/.svg executável)
  allowedExt: ['png','jpg','jpeg','gif','webp','avif','mp4','webm','mov','mp3','wav','ogg','m4a','pdf','txt','md','json','csv','xml','zip','tar','gz','7z','rar','epub','doc','docx','xls','xlsx','ppt','pptx','odt','ods','odp','mpg','mpeg','avi','mkv'],
  maxFileMB: 25
};
