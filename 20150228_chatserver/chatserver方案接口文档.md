chatserver�����ӿ��ĵ�
====

# ���ӷ�ʽ

- app��server֮����tcp over ssl�����ӡ�
- ssl���õ�����֤��client�����ṩ֤�飩
- keepalive������������ǰȡĬ��ֵ��

# ��¼

- appӦ�ý������Ӻ����̽��е�½
- appӦ���ڵ�½�ɹ�����ܷ�����Ϣ
- app��¼�ɹ�����serverһֱ���ֳ����ӣ�һ�������ͱ�ʾapp�˳���
- app��½ʧ�ܺ�Ӧ�����̶�����serverҲ������������
- TODO �������ڲ���֤�ӿ�

## ����

```
{
    "action": "login",
    "username": "13770827856",
    "password": "xxxxx"
}
```

## ��Ӧ

��¼�ɹ���

```
{
    "code": 0,
    "message": "success"
}
```

��¼ʧ�ܣ�

```
{
    "code": -1,
    "message": "invalid username or password"
}
```

# ��Ϣ

����Ҫ��֤���ѹ�ϵ�����Է�������ĺϷ�to��

```
{
    "action": "message",
    "from": "13700000001",
    "to": "13700000002",
    "timestamp": "2015-02-28 15:20:32",
    "content": {
        "type": "text/plain",
        "data": "hello"
    }
}
```

- message��Ϣ����Ӧ������������֤�ܹ�/���̷���to��
- content.type��ǰ֧���ı���text/plain����ͼƬ��image/png��������Ƕ����ƣ�����ͼƬ����content.data��Ҫbase64���롣
- ���to���ߣ�serverֱ�Ӱ�������Ϣ����to����ʽ������ͬ�ϣ�
- ���to�����ߣ���server����������Ϣ������server�Լ���timestamp����
- ��toʹ�õ�½�ӿڳɹ�����ʱ��server����Ϣ��server�Լ���timestamp���Ⱥ�˳�򷢸�to����������档
- ��ʱ�����ƻ�����Ϣ������
