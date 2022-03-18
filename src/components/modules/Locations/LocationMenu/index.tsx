import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from '../../../../contexts/location';
import { locationCategories } from '../../../../data/locationCategories';
import { sleep } from '../../../../utils/helpers/sleep';

type FormFields = {
	name: string,
	description?: string,
	locationCategoryId: number
}

export const LocationMenu = () => {
	const [locationFormOpen, setLocationFormOpen] = useState(false);

	const { location: locationSelected, selectLocation } = useLocation();

	useEffect(() => {
		if (!locationSelected) {
			setLocationFormOpen(false);
		}
	}, [locationSelected]);

	const openNotification = (type: string, message: string, err?: string) => {
		if(type == 'success' || type == 'error')
			notification[type]({ message: message, description: err});
		return;
	};

	const onFinish = async (values: FormFields) => {
		const requestData = {
			...locationSelected,
			...values
		};
		try {
			await sleep();
			console.log('Valores do formulário: ', requestData);
			openNotification('success', 'Dados enviados com sucesso');
			setLocationFormOpen(false);
			throw new Error('500');
		} catch (e) {
			await sleep();
			openNotification('error', 'Houve um erro ao enviar os dados');
			setLocationFormOpen(false);
		}
	};

	return (
		<>
			{locationFormOpen ? (
				<>
					<Form
						name="locationForm"
						onFinish={onFinish}
						autoComplete="off"
						labelCol={{ span: 24 }}
						initialValues={{
							...locationSelected,
							locationCategoryId: locationCategories.find((category) => category.id === locationSelected?.locationCategoryId)
						}}
					>
						<Form.Item
							label="NOME"
							name="name"
							rules={[{ required: true, message: 'INSIRA UM NOME PARA O LOCAL' }]}
						>
							<Input placeholder=' - ' size='large'/>
						</Form.Item>

						<Form.Item
							label="DESCRIÇÃO"
							name="description"
						>
							<Input.TextArea 
								placeholder=' - '
								showCount maxLength={255}
								style={{ height: 120 }}
								autoSize={{ minRows: 3, maxRows: 5 }}
								size='large'
							/>
						</Form.Item>

						<Form.Item 
							label="CATEGORIA"
							name="locationCategoryId"
							rules={[{ required: true, message: 'ESCOLHA UMA CATEGORIA PARA O LOCAL' }]}
						>
							<Select
								placeholder=" - "
								size='large'
							>
								{ locationCategories.map((category) => {
									return (
										<Select.Option key={category.id} value={category.id}>{category.name}</Select.Option>
									);
								}) }
							</Select>
						</Form.Item>

						<Form.Item>
							<Button size='large' type="primary" icon={<CheckOutlined />} htmlType="submit">
								Salvar
							</Button>
						</Form.Item>

						<Form.Item>
							<Button size='large' type="default" icon={<CloseOutlined />} onClick={() => {
								selectLocation(null);
								setLocationFormOpen(false);
							}}>
								Cancelar
							</Button>
						</Form.Item>
					</Form>
				</>
			) : (
				<>
					<Button 
						disabled={!locationSelected}
						onClick={() => setLocationFormOpen(true)}
						size='large'
					>Editar um local</Button>

					{!locationSelected && (
						<Typography.Title 
							level={4} 
							style={{ textAlign: 'center', margin: '1em 0' }}
						>
							SELECIONE UM LOCAL
						</Typography.Title>
					)}
				</>
			)}
		</>
	);
};

