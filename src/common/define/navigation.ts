
// output: "export" 에서는 동적 파라미터가 불가능하기 때문에
// 허용할 segment 목록을 미리 지정해야 함

export const ALLOWED_SEGMENTS_interface:string[] = ['html','css','svg','canvas'] as const;


export const navigation = [
    {
        children: [
            { path :'/interface/html', name: "HTML", key : 'html', active: true},
            { path :'/interface/css', name: "CSS", key : 'css', active: true},
            { path :'/interface/svg', name: "SVG", key : 'svg', active: true},
            { path :'/interface/canvas', name: "Canvas", key : 'canvas', active: true},
        ]
    },
    {
        children: [
            { path :'/front/javascript', name: "Javascript", key : 'javascript' , active: true},
            { path :'/front/react', name: "React", key : 'react' , active: true},
            { path :'/front/next', name: "Next", key : 'next', active: true},
            { path :'/front/knowledge', name: "Knowledge", key : 'knowledge'},
            //{ path :'/front/vue', name: "Vue", key : 'vue', active: false},
        ]
    },
    {
        children: [
            { path :'/back/java', name: "Java", key : 'java' , active: true},
            { path :'/back/python', name: "Python", key : 'python'},
            { path :'/back/node', name: "Node", key : 'node' , active: true},
            { path :'/back/nest', name: "Nest", key : 'nest', active: true},
        ]
    },
     {
        children: [
            { path :'/infra/nginx', name: "Nginx", key : 'nginx' , active: true},
            { path :'/infra/docker', name: "Docker", key : 'docker'},
            { path :'/infra/kubernetes', name: "Kubernetes", key : 'kubernetes' , active: true},
            { path :'/infra/redis', name: "Reids", key : 'redis', active: true},
        ]
    }
];      